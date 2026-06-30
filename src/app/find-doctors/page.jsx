import DoctorListingContainer from "./DoctorListingContainer";

export const metadata = {
    title: "Find Doctors | MediCare Connect",
    description: "Search and discover verified doctors by specialty, hospital, availability, and consultation preferences.",
    keywords: ["Find Doctors", "Verified Doctors", "Doctor Search", "Medical Specialists"],
};

async function getDoctors(queryString) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors?${queryString}`, {
  cache: "no-store",
});
  
  if (!res.ok) return { doctors: [], total: 0 };
  return res.json();
}

export default async function Page({ searchParams }) {
  const filters = await searchParams;

  // ডিফল্ট ফিল্টার অবজেক্ট তৈরি
  const filterObj = {
    search: filters?.search || "",
    specialization: filters?.specialization || "all",
    sort: filters?.sort || "default",
    page: parseInt(filters?.page, 10) || 1,
  };

  const querySearch = new URLSearchParams(filters);
  const queryString = querySearch.toString();

  console.log("Fetching doctors with query:", queryString);
  const { doctors, total } = await getDoctors(queryString);

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          Advanced Doctor Search
        </h1>
        <p className="text-zinc-400 mt-2">
          Find top-rated clinicians, filter by specialty, and schedule appointments instantly.
        </p>
      </div>

      {/* ক্লায়েন্ট র‍্যাপার কন্টেইনারে ডেটা পাস */}
      <DoctorListingContainer filters={filterObj} doctors={doctors || []} total={total} />
    </div>
  );
}