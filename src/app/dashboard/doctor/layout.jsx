import { requireRole } from '@/lib/core/session';


const DoctorLayout =async ({children}) => {
     await requireRole('doctor');
    return children
};

export default DoctorLayout;