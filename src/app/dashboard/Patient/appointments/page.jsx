import { getUserSession } from "@/lib/core/session"; // আপনার সেশন মেকানিজম অনুযায়ী
import AppointmentsListClient from "./AppointmentsListClient";


export const metadata = {
  title: "My Appointments - MediCare Connect",
};

const PatientAppointmentsPage = async () => {
  const user = await getUserSession();
  const patientId = user?._id || user?.id; // আপনার সেশনে যেভাবে মঙ্গো আইডি থাকে

  // ব্যাকএন্ড থেকে অ্যাপয়েন্টমেন্ট ডাটা নিয়ে আসা
  let appointments = [];
  if (patientId) {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/patient/${patientId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        appointments = await res.json();
      }
    } catch (error) {
      console.error("Failed to load appointments in server component:", error);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* হেডার পার্ট */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Appointment Records</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your scheduled sessions, timing, and history.</p>
        </div>
        <div className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs font-bold border">
          Total: {appointments.length}
        </div>
      </div>

      {/* ক্লায়েন্ট লিস্ট রেন্ডারিং ও CRUD হ্যান্ডলার */}
      <AppointmentsListClient initialAppointments={appointments} patientId={patientId} />
    </div>
  );
};

export default PatientAppointmentsPage;