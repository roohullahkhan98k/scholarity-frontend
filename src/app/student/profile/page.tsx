"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { studentService, StudentProfileResponse } from '@/services/studentService';
import { User, Book, Award, Settings, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './profile.module.css';

function StudentProfilePageContent() {
    const [profileData, setProfileData] = useState<StudentProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await studentService.getStudentProfile();
            setProfileData(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load student profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading profile...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Learning Profile</h1>
                <p className={styles.subtitle}>Track your progress and manage your interests</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainInfo}>
                    <div className={styles.card}>
                        <h3>About Me</h3>
                        <div className={styles.field}>
                            <label>Short Bio</label>
                            <p>{profileData?.profile.bio || 'Tell us something about yourself!'}</p>
                        </div>
                        <div className={styles.field}>
                            <label>Learning Interests</label>
                            <p>{profileData?.profile.interests || 'What do you want to learn?'}</p>
                        </div>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={`${styles.card} ${styles.activityCard}`}>
                        <h3>My Activity</h3>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>{profileData?.activity.enrolledCourses || 0}</span>
                                <span className={styles.statLabel}>Enrolled</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>{profileData?.activity.completedCourses || 0}</span>
                                <span className={styles.statLabel}>Completed</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>Quick Actions</h3>
                        <div className={styles.actions}>
                            <button className={styles.editBtn}>
                                <Settings size={18} style={{ marginRight: '8px' }} />
                                Account Settings
                            </button>
                            <Link href="/browse" className={styles.browseBtn}>
                                <Search size={18} style={{ marginRight: '8px' }} />
                                Explore Courses
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function StudentProfilePage() {
    return (
        <ProtectedRoute requiredRole="STUDENT">
            <StudentProfilePageContent />
        </ProtectedRoute>
    );
}
