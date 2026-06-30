import Banner from "@/components/Banner";
import WhyChooseSection from "@/components/WhyChooseSection";

export const metadata = {
    title: "Home | MediCare Connect",
    description:
        "Welcome to MediCare Connect. Find verified doctors, book appointments, manage healthcare services, and experience smarter medical care in one platform.",
    keywords: [
        "Home",
        "MediCare Connect",
        "Doctor Appointment",
        "Healthcare",
        "Medical Services",
        "Online Doctor Booking",
    ],
};


export default function Home() {
  return (
    <div>

<Banner></Banner>
<WhyChooseSection></WhyChooseSection>
    </div>
  );
}
