"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { teacherService, TeacherProfileResponse } from '@/services/teacherService';
import { User, Shield, BookOpen, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import styles from './profile.module.css';

function TeacherProfilePageContent() {
    const [profileData, setProfileData] = useState<TeacherProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await teacherService.getTeacherProfile();
            setProfileData(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load teacher profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading profile...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Teacher Profile</h1>
                <p className={styles.subtitle}>Manage your professional identity and verification status</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.mainInfo}>
                    <div className={styles.card}>
                        <h3>About Me</h3>
                        <div className={styles.field}>
                            <label>Biography</label>
                            <p>{profileData?.profile.bio || 'No bio provided.'}</p>
                        </div>
                        <div className={styles.field}>
                            <label>Expertise</label>
                            <p>{profileData?.profile.expertise || 'No expertise listed.'}</p>
                        </div>
                        <div className={styles.field}>
                            <label>Experience</label>
                            <p>{profileData?.profile.experience || 'Experience not specified.'}</p>
                        </div>
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={`${styles.card} ${styles.verificationCard}`}>
                        <h3>Verification Status</h3>
                        <div className={styles.statusBox}>
                            {profileData?.verification.status === 'APPROVED' && (
                                <div className={styles.approved}>
                                    <CheckCircle size={24} />
                                    <span>Verified Instructor</span>
                                </div>
                            )}
                            {profileData?.verification.status === 'PENDING' && (
                                <div className={styles.pending}>
                                    <Clock size={24} />
                                    <span>Verification Pending</span>
                                </div>
                            )}
                            {profileData?.verification.status === 'REJECTED' && (
                                <div className={styles.rejected}>
                                    <AlertTriangle size={24} />
                                    <span>Verification Rejected</span>
                                    {profileData.verification.rejectionReason && (
                                        <p className={styles.reason}>{profileData.verification.rejectionReason}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>Quick Actions</h3>
                        <button className={styles.editBtn}>Edit Profile</button>
                        <button className={styles.createBtn}>Create New Course</button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default function TeacherProfilePage() {
    return (
        <ProtectedRoute requiredRole="TEACHER">
            <TeacherProfilePageContent />
        </ProtectedRoute>
    );
}
