// 📂 src/app/dashboard/doctor/prescription/PrescriptionsClient.jsx
"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PrescriptionsClient({ acceptedAppointments, initialPrescriptions, currentDoctorId, doctorEmail }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlAppointmentId = searchParams.get('appointmentId');

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // 🎯 এডিটিং মোড ট্র্যাক করার জন্য নতুন স্টেট
    const [editPrescriptionId, setEditPrescriptionId] = useState(null);
    const [editingPatientName, setEditingPatientName] = useState('');

    // ইউআরএল আইডি দিয়ে অটোমেটিক পেশেন্ট সিলেক্ট করা ও ফর্ম সচল করা
    useEffect(() => {
        if (urlAppointmentId && acceptedAppointments.length > 0) {
            const target = acceptedAppointments.find(app => app._id === urlAppointmentId);
            if (target && selectedAppointment?._id !== target._id) {
                const timer = setTimeout(() => {
                    setEditPrescriptionId(null); // এডিট মোড অফ করা
                    setSelectedAppointment(target);
                }, 0);
                return () => clearTimeout(timer);
            }
        }
    }, [urlAppointmentId, acceptedAppointments, selectedAppointment]);

    // 🔄 "Modify Rx" বাটন ক্লিক হ্যান্ডলার
    const handleModifySetup = (rx) => {
        setEditPrescriptionId(rx._id);
        setEditingPatientName(rx.patientInfo?.name || 'Patient');
        
        // ফর্মে আগের ডেটা পপুলেট করা
        setDiagnosis(rx.diagnosis);
        setMedications(rx.medications);
        setNotes(rx.notes || '');

        // ফর্ম দেখার সুবিধার্থে স্ক্রিনের ওপরে স্ক্রল করা
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // এডিট/তৈরি মোড ক্যানসেল করার ফাংশন
    const handleCancel = () => {
        setDiagnosis('');
        setMedications('');
        setNotes('');
        setEditPrescriptionId(null);
        setSelectedAppointment(null);
        if (urlAppointmentId) {
            router.push('/dashboard/doctor/prescription');
        }
    };

    // ফর্ম সাবমিট হ্যান্ডলার (POST এবং PATCH উভয় মোড হ্যান্ডেল করবে)
    const handlePrescriptionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editPrescriptionId) {
                // 🔄 ১. PATCH: প্রেসক্রিপশন মডিফাই করার লজিক
                const patchPayload = { diagnosis, medications, notes };

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/prescriptions/${editPrescriptionId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patchPayload)
                });

                const result = await res.json();
                if (result.success) {
                    toast.success("Prescription modified successfully!");
                    handleCancel();
                    router.refresh(); // ডেটা রি-ফেচ করার জন্য
                } else {
                    toast.error(result.message || "Failed to update prescription");
                }
            } else {
                // 🟢 ২. POST: নতুন প্রেসক্রিপশন তৈরি করার লজিক
                if (!selectedAppointment || !currentDoctorId) {
                    setLoading(false);
                    return toast.error("Required IDs missing!");
                }

                const prescriptionPayload = {
                    doctorId: currentDoctorId,
                    patientId: selectedAppointment.patientId,
                    appointmentId: selectedAppointment._id,
                    diagnosis,
                    medications,
                    notes
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/prescriptions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(prescriptionPayload)
                });

                const result = await res.json();
                if (result.success) {
                    toast.success("Prescription created successfully!");
                    handleCancel();
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // ফর্ম ওপেন থাকবে যদি রোগী সিলেক্ট হয় অথবা এডিট মোড অন থাকে
    const isFormVisible = selectedAppointment || editPrescriptionId;
    const currentPatientName = editPrescriptionId ? editingPatientName : selectedAppointment?.patientInfo?.name;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            {/* ১. এক্সেপ্টেড অ্যাপয়েন্টমেন্ট কিউ */}
            {!editPrescriptionId && (
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <h3 className="text-sm font-semibold text-blue-600 mb-3">
                        🔵 ACCEPTED APPOINTMENTS QUEUE ({acceptedAppointments.length})
                    </h3>
                    {acceptedAppointments.length === 0 ? (
                        <p className="text-xs text-gray-400">No active accepted patients waiting for prescription.</p>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {acceptedAppointments.map((app) => (
                                <button
                                    key={app._id}
                                    onClick={() => {
                                        setEditPrescriptionId(null);
                                        setSelectedAppointment(app);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                                        selectedAppointment?._id === app._id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {app.patientInfo?.name || 'Unknown Patient'} (ID: {app._id.slice(-4)})
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ২. প্রেসক্রিপশন ইনপুট ফর্ম (পেশেন্ট সিলেক্ট হলে বা Modify Rx এ ক্লিক করলে দৃশ্যমান হবে) */}
            {isFormVisible && (
                <form onSubmit={handlePrescriptionSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4 ring-1 ring-blue-500/10">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-base font-bold text-gray-800">
                            {editPrescriptionId ? '⚙️ Modify Prescription for:' : '📝 Formulate Prescription for:'}{' '}
                            <span className="text-blue-600">{currentPatientName}</span>
                        </h3>
                        <button 
                            type="button" onClick={handleCancel}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg font-medium transition"
                        >
                            Cancel
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Diagnosis</label>
                        <input
                            type="text" required value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                            placeholder="e.g. Acute Diarrhoea, Mild Atherosclerosis"
                            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Medications</label>
                        <textarea
                            required rows="3" value={medications} onChange={e => setMedications(e.target.value)}
                            placeholder="e.g. Aspirin 81mg (Daily post breakfast)"
                            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Notes / Instructions (Optional)</label>
                        <textarea
                            rows="2" value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder="e.g. Avoid high-intensity aerobic stresses, less consume oil"
                            className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button" onClick={handleCancel}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-5 rounded-lg transition"
                        >
                            Close
                        </button>
                        <button
                            type="submit" disabled={loading}
                            className={`text-white font-medium text-sm py-2 px-6 rounded-lg transition ${
                                editPrescriptionId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Processing...' : editPrescriptionId ? 'Save Modifications' : 'Submit & Complete'}
                        </button>
                    </div>
                </form>
            )}

            {/* ৩. হিস্টোরিক্যাল ক্যাবিন লগ */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    HISTORICAL PRESCRIPTION CABIN LOGS
                </h3>

                {initialPrescriptions.length === 0 ? (
                    <div className="bg-gray-50 border border-dashed rounded-xl p-12 text-center text-gray-400">
                        No previous prescriptions recorded yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {initialPrescriptions.map((rx) => (
                            <div key={rx._id} className="bg-white p-5 rounded-xl shadow-sm border relative space-y-2 hover:shadow-sm transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{rx.patientInfo?.name || 'Patient'}</h4>
                                        <p className="text-[10px] text-gray-400" suppressHydrationWarning>
                                            Date of Issue: {new Date(rx.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {/* 🎯 "Modify Rx" বাটনে onClick হ্যান্ডলার যুক্ত করা হয়েছে */}
                                    <button 
                                        onClick={() => handleModifySetup(rx)}
                                        className="border px-3 py-1 rounded-lg text-xs font-medium hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-gray-600 transition"
                                    >
                                        Modify Rx
                                    </button>
                                </div>

                                <p className="text-xs text-gray-700 pt-2">
                                    <strong className="text-gray-900">Diagnosis:</strong> {rx.diagnosis}
                                </p>
                                <p className="text-xs text-gray-700">
                                    <strong className="text-gray-900">Medications:</strong> {rx.medications}
                                </p>
                                {rx.notes && (
                                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                                        <strong>Notes:</strong> {rx.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}