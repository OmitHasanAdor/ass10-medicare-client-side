"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Clock, DollarSign, FileText, AlertTriangle } from "lucide-react";

const AppointmentsListClient = ({ initialAppointments, patientId }) => {
  const [appointments, setAppointments] = useState(initialAppointments);
  
  // মোডাল ও অ্যাকশন স্টেটস
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' | 'reschedule' | 'cancel'
  
  // রিশেডিউল ফর্ম স্টেট
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM - 12:00 PM");

  const openModal = (appointment, type) => {
    setActiveAppointment(appointment);
    setModalType(type);
    if (type === "reschedule") {
      setNewDate(appointment.appointmentDate);
      setNewTime(appointment.appointmentTime);
    }
  };

  const closeModal = () => {
    setActiveAppointment(null);
    setModalType(null);
  };

  // ❌ CRUD: Cancel/Delete Handler
  const handleCancel = async () => {
    if (!activeAppointment) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/cancel/${activeAppointment._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAppointments(appointments.filter((app) => app._id !== activeAppointment._id));
        closeModal();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  // 🔄 CRUD: Reschedule Handler
  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!activeAppointment) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/reschedule/${activeAppointment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentDate: newDate, appointmentTime: newTime }),
      });

      if (res.ok) {
        setAppointments(
          appointments.map((app) =>
            app._id === activeAppointment._id
              ? { ...app, appointmentDate: newDate, appointmentTime: newTime, appointmentStatus: "pending" }
              : app
          )
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-8 text-gray-400">
        <Calendar className="size-12 mx-auto mb-3 opacity-30 text-blue-500" />
        <p className="text-sm font-medium">No appointments found.</p>
        <p className="text-xs text-gray-400 mt-1">Book a doctor from the find doctors page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((app) => {
        const doctor = app.doctorDetails || {};
        return (
          <div key={app._id} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* ডক্টর ইনফো ও বেসিক ডাটা */}
            <div className="flex items-start gap-4 w-full md:w-auto">
              <div className="relative size-14 bg-zinc-100 rounded-xl overflow-hidden border shrink-0">
                <Image
                  src={doctor.profileImage || "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp"}
                  alt={doctor.doctorName || "Doctor"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-gray-800 text-base">{doctor.doctorName || "Medical Specialist"}</h3>
                  <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border">
                    {doctor.specialization || "General"}
                  </span>
                </div>
                
                {/* মেটাডিটা গ্রিড */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-blue-500" /> {app.appointmentDate}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-amber-500" /> {app.appointmentTime}
                  </p>
                  <p className="flex items-center gap-1.5 col-span-1 sm:col-span-2">
                    <DollarSign className="size-3.5 text-emerald-500" /> 
                    Fee Paid: <span className="font-semibold text-gray-700">${app.amountPaid || "0"} ({app.paymentStatus})</span>
                  </p>
                </div>

                {/* সিম্পটমস শোকেস */}
                <div className="mt-2 text-xs bg-zinc-50 p-2.5 rounded-lg border text-gray-600 max-w-xl">
                  <span className="font-semibold text-gray-800">Symptoms:</span> {app.symptoms}
                </div>
                {app.stripeSessionId && (
                  <p className="text-[10px] text-gray-400 font-mono mt-1">Stripe ID: {app.stripeSessionId.substring(0, 20)}...</p>
                )}
              </div>
            </div>

            {/* অ্যাকশন বাটন এবং কারেন্ট স্ট্যাটাস */}
            <div className="flex flex-row md:flex-col lg:flex-row items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 justify-end">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mr-auto md:mr-0 ${
                app.appointmentStatus === "pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                app.appointmentStatus === "completed" ? "bg-green-50 text-green-600 border-green-200" :
                "bg-red-50 text-red-600 border-red-200"
              }`}>
                {app.appointmentStatus}
              </span>

              <button onClick={() => openModal(app, "view")} className="px-3 py-1.5 border text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-semibold transition">
                View
              </button>
              <button onClick={() => openModal(app, "reschedule")} className="px-3 py-1.5 border text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-semibold transition">
                Reschedule
              </button>
              <button onClick={() => openModal(app, "cancel")} className="px-3 py-1.5 border border-red-100 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition">
                Cancel
              </button>
            </div>

          </div>
        );
      })}

      {/* ─── 📦 HEROUI/CUSTOM MODAL IMPLEMENTATION ─── */}
      {modalType && activeAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border animate-in fade-in zoom-in-95 duration-200 space-y-4">
            
            {/* ১. VIEW MODAL */}
            {modalType === "view" && (
              <>
                <div className="flex items-center gap-2 border-b pb-2">
                  <FileText className="size-5 text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-800">Appointment Details</h3>
                </div>
                <div className="space-y-2.5 text-sm text-gray-600 pt-2">
                  <p><span className="font-semibold text-gray-800">Doctor:</span> {activeAppointment.doctorDetails?.doctorName}</p>
                  <p><span className="font-semibold text-gray-800">Specialization:</span> {activeAppointment.doctorDetails?.specialization}</p>
                  <p><span className="font-semibold text-gray-800">Date:</span> {activeAppointment.appointmentDate}</p>
                  <p><span className="font-semibold text-gray-800">Time Slot:</span> {activeAppointment.appointmentTime}</p>
                  <p><span className="font-semibold text-gray-800">Symptoms:</span> {activeAppointment.symptoms}</p>
                  <p><span className="font-semibold text-gray-800">Payment status:</span> {activeAppointment.paymentStatus} (${activeAppointment.amountPaid})</p>
                  <p><span className="font-semibold text-gray-800">Booking Status:</span> <span className="capitalize font-bold text-blue-600">{activeAppointment.appointmentStatus}</span></p>
                </div>
              </>
            )}

            {/* ২. RESCHEDULE MODAL */}
            {modalType === "reschedule" && (
              <form onSubmit={handleReschedule} className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Calendar className="size-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-gray-800">Reschedule Session</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Pick New Date</label>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required className="w-full border p-2 rounded-xl text-sm bg-gray-50 focus:bg-white outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Select Time Slot</label>
                    <select value={newTime} onChange={(e) => setNewTime(e.target.value)} required className="w-full border p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white outline-none">
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                      <option value="07:00 PM - 09:00 PM">07:00 PM - 09:00 PM</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold text-xs hover:bg-blue-700 transition">Save Changes</button>
              </form>
            )}

            {/* ৩. CANCEL MODAL */}
            {modalType === "cancel" && (
              <>
                <div className="flex items-center gap-2 border-b pb-2 text-red-600">
                  <AlertTriangle className="size-5" />
                  <h3 className="text-lg font-bold">Cancel Appointment</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Are you sure you want to completely delete this appointment with <span className="font-bold text-gray-800">{activeAppointment.doctorDetails?.doctorName}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-2 pt-2">
                  <button onClick={closeModal} className="w-full border py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">Keep Booking</button>
                  <button onClick={handleCancel} className="w-full bg-red-600 text-white py-2 rounded-xl font-semibold text-xs hover:bg-red-700 transition">Yes, Delete</button>
                </div>
              </>
            )}

            {/* ক্লোজ ফুটার (ভিউ মোডালের জন্য বা নরমাল ক্লোজ বাটন) */}
            {modalType === "view" && (
              <button onClick={closeModal} className="w-full border py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition mt-2">
                Close View
              </button>
            )}
            {modalType !== "view" && (
              <button onClick={closeModal} className="text-center w-full block text-xs text-gray-400 hover:underline pt-1">
                Nevermind, go back
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsListClient;