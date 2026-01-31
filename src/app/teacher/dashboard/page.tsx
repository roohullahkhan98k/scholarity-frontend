"use client";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import styles from './dashboard.module.css';

function TeacherDashboardContent() {
    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Welcome back, {user?.name}! 👋</h1>
                <p className={styles.subtitle}>Manage your courses and connect with students</p>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Active Students</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Courses</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>$0</div>
                    <div className={styles.statLabel}>Earnings</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Reviews</div>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Quick Actions</h2>
                    <div className={styles.actions}>
                        <button className="btn btn-primary" style={{ width: '100%' }}>
                            Create New Course
                        </button>
                        <button className="btn btn-outline" style={{ width: '100%' }}>
                            View Students
                        </button>
                        <button className="btn btn-outline" style={{ width: '100%' }}>
                            Manage Schedule
                        </button>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Recent Activity</h2>
                    <div className={styles.empty}>
                        <p>No recent activity yet.</p>
                        <p className={styles.hint}>Start by creating your first course!</p>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Your Courses</h2>
                <div className={styles.empty}>
                    <p>You haven't created any courses yet.</p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Create Your First Course
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TeacherDashboard() {
    return (
        <ProtectedRoute requiredRole="teacher">
            <TeacherDashboardContent />
        </ProtectedRoute>
    );
}
