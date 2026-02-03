"use client";
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isAdminPage = pathname?.startsWith('/admin');
    const isTeacherPage = pathname?.startsWith('/teacher');
    const isBecomeInstructorPage = pathname === '/become-instructor';

    if (isAuthPage || isAdminPage || isTeacherPage || isBecomeInstructorPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
