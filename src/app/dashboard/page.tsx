"use client";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import TeacherCard from '@/components/TeacherCard/TeacherCard';
import { teachers } from '@/data/teachers';
import styles from './dashboard.module.css';

function StudentDashboardContent() {
    const { user } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Welcome back, {user?.name}! 👋</h1>
                <p className={styles.subtitle}>Continue your learning journey</p>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Enrolled Courses</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Hours Learned</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Certificates</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>0</div>
                    <div className={styles.statLabel}>Achievements</div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Continue Learning</h2>
                <div className={styles.empty}>
                    <p>You haven't enrolled in any courses yet.</p>
                    <p className={styles.hint}>Browse our catalog to find the perfect course for you!</p>
                    <a href="/browse" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Browse Courses
                    </a>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Recommended Instructors</h2>
                <div className={styles.teacherGrid}>
                    {teachers.slice(0, 3).map((teacher) => (
                        <TeacherCard key={teacher.id} teacher={teacher} />
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.actions}>
                    <div className={styles.actionCard}>
                        <div className={styles.icon}>📚</div>
                        <h3>Browse Courses</h3>
                        <p>Explore thousands of courses</p>
                        <a href="/browse" className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>
                            Explore
                        </a>
                    </div>
                    <div className={styles.actionCard}>
                        <div className={styles.icon}>👨‍🏫</div>
                        <h3>Become an Instructor</h3>
                        <p>Share your knowledge</p>
                        <a href="/become-instructor" className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>
                            Apply Now
                        </a>
                    </div>
                    <div className={styles.actionCard}>
                        <div className={styles.icon}>⭐</div>
                        <h3>My Reviews</h3>
                        <p>View your feedback</p>
                        <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>
                            View Reviews
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <ProtectedRoute requiredRole="STUDENT">
            <StudentDashboardContent />
        </ProtectedRoute>
    );
}
