import {
  ShieldCheck,
  CalendarClock,
  Stethoscope,
  CreditCard,
} from "lucide-react";

export default function WhyChooseSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Healthcare Professionals",
      description:
        "Every doctor profile is carefully reviewed and verified by administrators, ensuring patients receive trusted and reliable healthcare services.",
    },
    {
      icon: CalendarClock,
      title: "Easy Appointment Management",
      description:
        "Book, reschedule, or cancel appointments in just a few clicks. Doctors can also manage their schedules effortlessly from the dashboard.",
    },
    {
      icon: CreditCard,
      title: "Secure Online Payments",
      description:
        "Integrated online payment system allows patients to pay consultation fees safely and receive instant booking confirmation.",
    },
    {
      icon: Stethoscope,
      title: "Complete Healthcare Platform",
      description:
        "Manage appointments, medical records, consultations, and hospital services from one centralized healthcare platform.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-[32px] overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative">

          {/* Background Blur */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-400/10 blur-3xl rounded-full"></div>

          <div className="relative z-10 px-8 md:px-16 py-20">

            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-2 rounded-full text-sm font-medium">
              <ShieldCheck size={18} />
              Why Choose MediCare Connect
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold">
              Modern Healthcare,
              <br />
              Simplified For Everyone
            </h2>

            <p className="mt-6 max-w-3xl text-blue-100 leading-8 text-lg">
              MediCare Connect is a modern healthcare management platform that
              connects patients with doctors and hospitals through one
              centralized system. Patients can book appointments, manage medical
              records, make secure payments, and receive healthcare services
              efficiently while doctors and administrators manage everything
              from a single dashboard.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

              {features.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 p-7 hover:bg-white/15 duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center">
                      <Icon size={30} />
                    </div>

                    <h3 className="text-xl font-semibold mt-6">
                      {item.title}
                    </h3>

                    <div className="w-12 h-1 rounded-full bg-cyan-400 mt-4"></div>

                    <p className="text-blue-100 mt-5 leading-7 text-sm">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}