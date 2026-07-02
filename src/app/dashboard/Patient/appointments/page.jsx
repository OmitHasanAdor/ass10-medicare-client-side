import { getUserSession } from "@/lib/core/session"; // According to your session mechanism
import AppointmentsListClient from "./AppointmentsListClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "My Appointments | MediCare Connect",
    description: "View, manage, and track your upcoming, completed, and cancelled medical appointments with verified doctors.",
    keywords: ["Appointments", "Medical Booking", "Doctor Appointments", "Patient Schedule"],
};

const PatientAppointmentsPage = async () => {
  const user = await getUserSession();
  const patientId = user?._id || user?.id; // Standard MongoDB user ID mapping from your session template

  // Fetch appointment data from the backend
  let appointments = [];
  if (patientId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/patient/${patientId}`, {
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
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Appointment Records</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your scheduled sessions, timing, and history.</p>
        </div>
        <div className="bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-xs font-bold border">
          Total: {appointments.length}
        </div>
      </div>

      {/* Client List Rendering & CRUD Handlers */}
      <AppointmentsListClient initialAppointments={appointments} patientId={patientId} />
    </div>
  );
};

export default PatientAppointmentsPage;