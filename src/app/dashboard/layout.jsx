import { requireRole } from '@/lib/core/session';

export default async function PatientLayout({ children }) {
    await requireRole('patient');

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {children}
        </div>
    );
}