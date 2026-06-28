"use client"
import React, { useState } from 'react';
import { Send, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            toast.success("Thank you! Your message has been routed to our clinical desk.");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Send a Digital Inquiry</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Full Name</label>
                        <input 
                            type="text" required value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="block w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/10"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Email Address</label>
                        <input 
                            type="email" required value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="block w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/10"
                            placeholder="doctor@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Subject</label>
                    <input 
                        type="text" required value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="block w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/10"
                        placeholder="e.g., Doctor Verification Query"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Inquiry Message</label>
                    <textarea 
                        required rows="4" value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="block w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-600/10 resize-none"
                        placeholder="Write your details here..."
                    ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit" disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Dispatch Message
                    </button>
                </div>
            </form>
        </div>
    );
}