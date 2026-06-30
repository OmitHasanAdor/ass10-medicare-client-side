import Banner from "@/components/Banner";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import MedicalSpecializations from "@/components/MedicalSpecializations";
import PlatformAnalytics from "@/components/PlatformAnalytics";
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
<MedicalSpecializations></MedicalSpecializations>
<FeaturedDoctors></FeaturedDoctors>
<PlatformAnalytics></PlatformAnalytics>
<WhyChooseSection></WhyChooseSection>
    </div>
  );
}
