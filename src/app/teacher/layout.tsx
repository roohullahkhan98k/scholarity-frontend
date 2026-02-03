import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import styles from './layout.module.css';

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.teacherLayout}>
            <TeacherSidebar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
