import React from 'react';
import DoctorCredentialsForm from './DoctorCredentialsForm';

async function getDoctorData(email) {
    if (!email) return { userData: null, doctorData: null };

    try {
        const [userRes, doctorRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user-role?email=${email}`, { cache: 'no-store' }),
            fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor-profile?email=${email}`, { cache: 'no-store' })
        ]);

        const userData = userRes.ok ? await userRes.json() : null;
        const doctorData = doctorRes.ok ? await doctorRes.json() : null;

        return { userData, doctorData };
    } catch (error) {
        console.error("Error fetching data on server:", error);
        return { userData: null, doctorData: null };
    }
}

export default async function DoctorCredentialsPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const email = resolvedSearchParams?.email || "doctor@doctor.com";

    const { userData, doctorData } = await getDoctorData(email);

    // usersCollection থেকে আসা একদম বেসিক কিছু ডাটা যা টপ ব্যানারে জাস্ট দেখানোর জন্য লাগবে
    const userBasicInfo = {
        email: email,
        name: doctorData?.doctorName || userData?.name || 'Doctor',
        photo: doctorData?.profileImage || userData?.photo || 'https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp',
        status: doctorData?.verificationStatus || 'Verified'
    };

    // 🎯 ফর্মের ইনপুট ফিল্ডের জন্য আপনার চাওয়া সবকটি প্রফেশনাল ফিল্ড (ডাটা থাকলে অটো-ফিল হবে)
    const initialFormData = {
        doctorName: doctorData?.doctorName || userData?.name || '',
        specialization: doctorData?.specialization || '',
        qualifications: doctorData?.qualifications || '',
        experience: doctorData?.experience || '',
        consultationFee: doctorData?.consultationFee || '',
        hospitalName: doctorData?.hospitalName || '',
        availableDays: Array.isArray(doctorData?.availableDays)
            ? doctorData?.availableDays.join(', ')
            : '',
        availableSlots: Array.isArray(doctorData?.availableSlots)
            ? doctorData?.availableSlots.join(', ')
            : ''
    };

    return (
        <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Professional Credentials Setup</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Please fill out all the fields below to complete your doctor profile setup.
                </p>
            </div>

            <DoctorCredentialsForm
                key={userBasicInfo?.email || "doctor-form"}
                userBasicInfo={userBasicInfo}
                initialFormData={initialFormData}
            />
        </div>
    );
}