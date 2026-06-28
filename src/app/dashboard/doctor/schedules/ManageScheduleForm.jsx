// 📂 src/app/dashboard/doctor/schedules/ManageScheduleForm.jsx
"use client"
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Calendar, Clock, RefreshCw, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DAYS_POOL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SLOTS_POOL = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM"
];

export default function ManageScheduleForm({ initialSchedule }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    // ডাইনামিক অ্যারে স্টেট ম্যানেজমেন্ট (initialSchedule থেকে আসা ডাটা সরাসরি সেভ হবে)
    const [selectedDays, setSelectedDays] = useState(initialSchedule?.availableDays || []);
    const [selectedSlots, setSelectedSlots] = useState(initialSchedule?.availableSlots || []);

    // ড্রপডাউন সিলেক্টেড রাখার স্টেট
    const [currentDayInput, setCurrentDayInput] = useState(DAYS_POOL[0]);
    const [currentSlotInput, setCurrentSlotInput] = useState(SLOTS_POOL[0]);

    // দিন যোগ করা
    const addDay = () => {
        if (selectedDays.includes(currentDayInput)) {
            return toast.error("This day is already added!");
        }
        setSelectedDays([...selectedDays, currentDayInput]);
        toast.success(`${currentDayInput} added`);
    };

    // দিন মুছে ফেলা
    const removeDay = (dayToRemove) => {
        setSelectedDays(selectedDays.filter(day => day !== dayToRemove));
    };

    // টাইম স্লট যোগ করা
    const addSlot = () => {
        if (selectedSlots.includes(currentSlotInput)) {
            return toast.error("This time slot is already added!");
        }
        setSelectedSlots([...selectedSlots, currentSlotInput]);
        toast.success("Time slot added");
    };

    // টাইম স্লট মুছে ফেলা
    const removeSlot = (slotToRemove) => {
        setSelectedSlots(selectedSlots.filter(slot => slot !== slotToRemove));
    };

    // PATCH API কল সাবমিশন
    const handleSaveChanges = async () => {
        if (selectedDays.length === 0) {
            return toast.error("Please add at least one working day!");
        }
        if (selectedSlots.length === 0) {
            return toast.error("Please add at least one appointment slot!");
        }

        setLoading(true);

        const payload = {
            email: initialSchedule.email,
            availableDays: selectedDays,
            availableSlots: selectedSlots
        };

        try {
            const response = await fetch('http://localhost:5000/api/doctor/update-schedule', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    // 💡 ডাটা আসামাত্র যেন স্টেট সিঙ্ক হয় তার জন্য ইউনিক কী (Key) জেনারেট করা হলো
    const scheduleKey = initialSchedule?.availableDays?.length + initialSchedule?.availableSlots?.length || "initial";

    return (
        <div key={scheduleKey} className="space-y-6"> {/* 👈 এখানে key যুক্ত করায় ডাটা আসামাত্রই রেন্ডার হবে এবং রিপ্লেস প্রবলেম সলভ হবে */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* 🗓️ WORKING WEEKDAYS CARD */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" /> Working Weekdays
                        </h3>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                            Configure Days
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={currentDayInput}
                            onChange={(e) => setCurrentDayInput(e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        >
                            {DAYS_POOL.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <button
                            type="button" onClick={addDay}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-700 transition"
                        >
                            <Plus className="h-4 w-4" /> Add
                        </button>
                    </div>

                    {/* ব্যাজ আকারে সিলেক্টেড দিনগুলোর লিস্ট */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {selectedDays.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No working days added yet.</p>
                        ) : (
                            selectedDays.map((day) => (
                                <div key={day} className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                    <span>{day}</span>
                                    <button 
                                        type="button" onClick={() => removeDay(day)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ⏰ CONFIGURED APPOINTMENT HOURS CARD */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" /> Configured Appointment Hours
                        </h3>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={currentSlotInput}
                            onChange={(e) => setCurrentSlotInput(e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        >
                            {SLOTS_POOL.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                        <button
                            type="button" onClick={addSlot}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-emerald-700 transition"
                        >
                            <Plus className="h-4 w-4" /> Add
                        </button>
                    </div>

                    {/* ব্যাজ আকারে সিলেক্টেড টাইম স্লটগুলোর লিস্ট */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {selectedSlots.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No time slots added yet.</p>
                        ) : (
                            selectedSlots.map((slot) => (
                                <div key={slot} className="inline-flex items-center gap-2 rounded-xl bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100">
                                    <span>{slot}</span>
                                    <button 
                                        type="button" onClick={() => removeSlot(slot)}
                                        className="text-blue-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* 💾 SAVE CHANGES FIXED ACTION ROW */}
            <div className="flex items-center justify-end rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <button
                    type="button"
                    disabled={loading}
                    onClick={handleSaveChanges}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Schedule Changes
                </button>
            </div>
        </div>
    );
}