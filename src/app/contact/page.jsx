import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import ContactForm from './ContactForm';

// 💡 Next.js SEO Metadata (Server-side)
export const metadata = {
    title: 'Contact Us | MediCare Connect',
    description: 'Get in touch with the MediCare Connect team. Have queries regarding doctor verification status, credentials, support, or portal setups? Drop us a message.',
    keywords: ['Contact Us', 'Customer Support', 'MediCare Support', 'Doctor Helpdesk'],
};

export default function ContactUsPage() {
    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Title Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-50 rounded-full">
                        Get In Touch
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
                        We are Always Here to Assist You
                    </h1>
                    <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                        Have queries regarding doctor verification status, API endpoints or setup portals? Drop a message and our support specialist will reach out.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Information Grid Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Email Our Desk</h4>
                                <p className="text-xs text-slate-500 mt-1">support@medicareconnect.com</p>
                                <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Response within 3 hours</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Call Support</h4>
                                <p className="text-xs text-slate-500 mt-1">+880 1234-567890</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Sat - Thu, 09 AM - 06 PM</p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">HQ Office Location</h4>
                                <p className="text-xs text-slate-500 mt-1">Dhaka, Bangladesh</p>
                            </div>
                        </div>

                        <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white p-5 rounded-2xl shadow-sm space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                                <ShieldCheck className="h-4 w-4" /> SECURE INTEGRATION
                            </div>
                            <p className="text-xs text-blue-100 leading-relaxed">
                                Patient-Doctor interactions and data logs are protected with end-to-end encrypted protocol structures.
                            </p>
                        </div>
                    </div>

                    {/* Imported Interactive Client Form */}
                    <ContactForm />

                </div>
            </div>
        </div>
    );
}