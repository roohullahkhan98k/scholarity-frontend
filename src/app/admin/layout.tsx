import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './layout.module.css';
import { GlobalLoader } from '@/components/admin/GlobalLoader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminLayout}>
            <GlobalLoader />
            <AdminSidebar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
