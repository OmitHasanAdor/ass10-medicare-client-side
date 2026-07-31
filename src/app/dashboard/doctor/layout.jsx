import { requireRole } from "@/lib/core/session";



const DoctorLayout = async ({children}) => {
     await requireRole('doctor');
     console.log("Doctor Layout");
    return children
};

export default DoctorLayout;