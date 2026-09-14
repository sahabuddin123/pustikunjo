<?php

namespace App\Services\Email;

use App\Models\EmailLog;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    /**
     * Configure dynamic SMTP settings from SiteSetting
     */
    public function configureSmtp(): void
    {
        $smtp = SiteSetting::get('email_smtp', []);

        if (!empty($smtp['host'])) {
            Config::set([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => $smtp['host'],
                'mail.mailers.smtp.port' => (int) ($smtp['port'] ?? 587),
                'mail.mailers.smtp.encryption' => $smtp['encryption'] ?? 'tls',
                'mail.mailers.smtp.username' => $smtp['username'] ?? '',
                'mail.mailers.smtp.password' => $smtp['password'] ?? '',
                'mail.from.address' => $smtp['from_address'] ?? 'info@pustikunjo.com.bd',
                'mail.from.name' => $smtp['from_name'] ?? 'Pusti Kunjo',
            ]);
        }
    }

    /**
     * Send HTML email with logging
     */
    public function sendEmail(string $to, string $subject, string $htmlContent, ?string $eventName = null): array
    {
        if (empty($to) || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false,
                'error' => 'ভুল অথবা খালি ইমেইল অ্যাড্রেস।',
            ];
        }

        $this->configureSmtp();

        $contact = SiteSetting::get('contact', []);
        $supportPhone = $contact['phone'] ?? '01700-000000';

        $status = 'sent';
        $errorMessage = null;

        try {
            Mail::send('emails.notification', [
                'content' => $htmlContent,
                'subject' => $subject,
                'supportPhone' => $supportPhone,
            ], function ($message) use ($to, $subject) {
                $message->to($to)
                        ->subject($subject);
            });
        } catch (\Exception $e) {
            $status = 'failed';
            $errorMessage = $e->getMessage();
            Log::error("Email Dispatch Error to [{$to}] for event [{$eventName}]: " . $e->getMessage());
        }

        // Record in email_logs
        EmailLog::create([
            'recipient_email' => $to,
            'subject' => $subject,
            'body' => $htmlContent,
            'event_name' => $eventName,
            'status' => $status,
            'error_message' => $errorMessage,
        ]);

        return [
            'success' => $status === 'sent',
            'to' => $to,
            'status' => $status,
            'error' => $errorMessage,
        ];
    }
}
