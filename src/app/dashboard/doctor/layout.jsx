import { requireRole } from '@/lib/core/session';
import React from 'react';

const DoctorLayout =async ({children}) => {
     await requireRole('doctor');
    return children
};

export default DoctorLayout;