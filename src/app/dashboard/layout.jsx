
import { DashboardSidebar } from '@/components/DashboardSidebar';
import React from 'react';

const DasboardLayout = ({children}) => {
    return (
           <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default DasboardLayout;