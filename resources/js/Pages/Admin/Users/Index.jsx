import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Shield, X, Check } from 'lucide-react';

export default function UsersIndex({ users = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const form = useForm({
        name: '',
        email: '',
        role: 'admin', // super_admin, admin, manager
        password: '',
    });

    const openCreate = () => {
        setEditingUser(null);
        form.reset();
        setShowModal(true);
    };

    const openEdit = (u) => {
        setEditingUser(u);
        form.setData({
            name: u.name,
            email: u.email,
            role: u.role || 'admin',
            password: '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            form.put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            form.post('/admin/users', {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (u) => {
        if (confirm(`Are you sure you want to delete user "${u.name}"?`)) {
            router.delete(`/admin/users/${u.id}`);
        }
    };

    return (
        <AdminLayout title="Users & Roles">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Users & Roles</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Manage team members and permissions: Super Admin, Admin, and Manager.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Team Member</span>
                    </button>
                </div>

                {/* Role Description Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-gray-100 text-xs shadow-2xs">
                        <span className="font-bold text-emerald-800 block">Super Admin</span>
                        <p className="text-gray-500 mt-1">Full access to settings, users, payment gateways, marketing, and reports.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-gray-100 text-xs shadow-2xs">
                        <span className="font-bold text-blue-800 block">Admin</span>
                        <p className="text-gray-500 mt-1">Manage products, orders, categories, appearance, and blog. No user deletion.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-gray-100 text-xs shadow-2xs">
                        <span className="font-bold text-amber-800 block">Manager</span>
                        <p className="text-gray-500 mt-1">Dedicated access to update product inventory and process customer orders.</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-3.5">Name</th>
                                    <th className="px-5 py-3.5">Email</th>
                                    <th className="px-5 py-3.5">Role</th>
                                    <th className="px-5 py-3.5">Created Date</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3 font-semibold text-gray-900">
                                            {u.name}
                                        </td>
                                        <td className="px-5 py-3 font-mono text-gray-600">
                                            {u.email}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                                                u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                                {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Manager'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500">
                                            {new Date(u.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-5 py-3 text-right space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => openEdit(u)}
                                                className="inline-flex p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(u)}
                                                className="inline-flex p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 space-y-4 animate-scale-up">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h3 className="font-bold text-sm text-gray-900">
                                    {editingUser ? 'Edit User' : 'Create Team Member'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                                <div>
                                    <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                                    />
                                    {form.errors.name && <p className="text-rose-500 mt-1">{form.errors.name}</p>}
                                </div>

                                <div>
                                    <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                                    />
                                    {form.errors.email && <p className="text-rose-500 mt-1">{form.errors.email}</p>}
                                </div>

                                <div>
                                    <label className="font-bold text-gray-700 block mb-1">Role Permission</label>
                                    <select
                                        value={form.data.role}
                                        onChange={(e) => form.setData('role', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 bg-white"
                                    >
                                        <option value="super_admin">Super Admin (Full Access)</option>
                                        <option value="admin">Admin (Standard)</option>
                                        <option value="manager">Manager (Orders & Products)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="font-bold text-gray-700 block mb-1">
                                        {editingUser ? 'Password (leave blank to keep unchanged)' : 'Password'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        placeholder="Min 6 characters"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600"
                                    />
                                    {form.errors.password && <p className="text-rose-500 mt-1">{form.errors.password}</p>}
                                </div>

                                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="px-5 py-2 bg-emerald-800 text-white rounded-xl font-semibold hover:bg-emerald-900 transition-colors disabled:opacity-50"
                                    >
                                        {form.processing ? 'Saving...' : 'Save User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
