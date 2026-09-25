import { requireRole } from '@/lib/core/session';

const PatientLayout = async ({children}) => {
     await requireRole('patient');
    return children
};

export default PatientLayout;