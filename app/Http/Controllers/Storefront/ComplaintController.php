<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Services\Sms\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    /**
     * Display the complaint submission page
     */
    public function index(Request $request)
    {
        $ticketQuery = $request->query('ticket');
        $trackedComplaint = null;

        if ($ticketQuery) {
            $trackedComplaint = Complaint::where('ticket_number', trim($ticketQuery))->first();
        }

        $user = auth()->user();
        $myComplaints = [];

        if ($user && !empty($user->phone)) {
            $myComplaints = Complaint::where('phone', $user->phone)
                ->orWhere('phone', 'like', '%' . substr($user->phone, -10))
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('Storefront/Complaint', [
            'trackedComplaint' => $trackedComplaint,
            'myComplaints' => $myComplaints,
            'initialPhone' => $user ? ($user->phone ?? '') : '',
            'initialName' => $user ? ($user->name ?? '') : '',
        ]);
    }

    /**
     * Submit a customer complaint
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'min:10', 'max:20'],
            'issue_details' => ['required', 'string', 'min:5', 'max:5000'],
            'name' => ['nullable', 'string', 'max:150'],
            'order_number' => ['nullable', 'string', 'max:100'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['nullable', 'string'],
            'photo_files' => ['nullable', 'array'],
            'photo_files.*' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:10240'],
        ]);

        $allPhotos = [];

        // 1. Process array of photo URL strings (e.g. from URL input or MediaPicker)
        if (!empty($validated['photos']) && is_array($validated['photos'])) {
            foreach ($validated['photos'] as $photoUrl) {
                if (is_string($photoUrl) && !empty(trim($photoUrl))) {
                    $allPhotos[] = trim($photoUrl);
                }
            }
        }

        // 2. Process file uploads if uploaded directly
        if ($request->hasFile('photo_files')) {
            $uploadPath = public_path('uploads/complaints');
            if (!File::exists($uploadPath)) {
                File::makeDirectory($uploadPath, 0755, true);
            }

            foreach ($request->file('photo_files') as $file) {
                if ($file && $file->isValid()) {
                    $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move($uploadPath, $filename);
                    $allPhotos[] = asset('uploads/complaints/' . $filename);
                }
            }
        }

        $complaint = Complaint::create([
            'phone' => trim($validated['phone']),
            'name' => $validated['name'] ?? null,
            'order_number' => !empty($validated['order_number']) ? trim($validated['order_number']) : null,
            'issue_details' => trim($validated['issue_details']),
            'photos' => !empty($allPhotos) ? array_values(array_unique($allPhotos)) : null,
            'status' => 'pending',
        ]);

        // Attempt optional SMS notification
        try {
            app(SmsService::class)->sendSms(
                $complaint->phone,
                "আপনার অভিযোগটি সফলভাবে গ্রহণ করা হয়েছে। টিকিট নং: {$complaint->ticket_number}। পুষ্টি কুঞ্জ কাস্টমার কেয়ার টিম দ্রুত আপনার সাথে যোগাযোগ করবে।",
                'complaint_submitted'
            );
        } catch (\Throwable $e) {
            // Log or ignore SMS failure
        }

        return redirect()->route('complaint.index', ['ticket' => $complaint->ticket_number])
            ->with('success', "আপনার অভিযোগ সফলভাবে দাখিল করা হয়েছে! টিকিট নম্বর: {$complaint->ticket_number}। আমাদের প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।");
    }

    /**
     * Admin Complaints Listing
     */
    public function adminIndex(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = Complaint::query()->latest();

        if ($status && in_array($status, ['pending', 'under_review', 'resolved', 'rejected'])) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('order_number', 'like', "%{$search}%")
                  ->orWhere('issue_details', 'like', "%{$search}%");
            });
        }

        $complaints = $query->paginate(20)->withQueryString();

        $stats = [
            'total' => Complaint::count(),
            'pending' => Complaint::where('status', 'pending')->count(),
            'under_review' => Complaint::where('status', 'under_review')->count(),
            'resolved' => Complaint::where('status', 'resolved')->count(),
            'rejected' => Complaint::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Complaints/Index', [
            'complaints' => $complaints,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Admin update complaint status & notes
     */
    public function adminUpdateStatus(Request $request, $id)
    {
        $complaint = Complaint::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,under_review,resolved,rejected'],
            'admin_notes' => ['nullable', 'string'],
            'notify_customer' => ['nullable', 'boolean'],
        ]);

        $complaint->status = $validated['status'];
        $complaint->admin_notes = $validated['admin_notes'] ?? $complaint->admin_notes;

        if ($validated['status'] === 'resolved' && !$complaint->resolved_at) {
            $complaint->resolved_at = now();
        }

        $complaint->save();

        if (!empty($validated['notify_customer'])) {
            try {
                $statusBn = [
                    'pending' => 'অপেক্ষারত',
                    'under_review' => 'পর্যালোচনাধীন',
                    'resolved' => 'সমাধান করা হয়েছে',
                    'rejected' => 'বাতিল করা হয়েছে',
                ][$validated['status']] ?? $validated['status'];

                $msg = "আপনার টিকিট নং {$complaint->ticket_number}-এর স্ট্যাটাস আপডেট: {$statusBn}। ধন্যবাদ, পুষ্টি কুঞ্জ।";
                app(SmsService::class)->sendSms($complaint->phone, $msg, 'complaint_status_update');
            } catch (\Throwable $e) {
                // ignore SMS failure
            }
        }

        return back()->with('success', "অভিযোগ #{$complaint->ticket_number}-এর স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।");
    }
}
