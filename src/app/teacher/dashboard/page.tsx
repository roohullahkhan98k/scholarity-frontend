"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import styles from './dashboard.module.css';
import { academicService } from '@/services/academicService';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton/LoadingButton';

function TeacherDashboardContent() {
    const { user } = useAuth();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestType, setRequestType] = useState<'CATEGORY' | 'SUBJECT'>('CATEGORY');
    const [requestName, setRequestName] = useState('');
    const [requestDescription, setRequestDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await academicService.createRequest({
                type: requestType,
                name: requestName,
                description: requestDescription
            });
            toast.success('Request submitted successfully!');
            setIsRequestModalOpen(false);
            setRequestName('');
            setRequestDescription('');
        } catch (error) {
            toast.error('Failed to submit request.');
        } finally {
            setSubmitting(false);
        }
    };

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
                        <Link href="/courses/create" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                            Create New Course
                        </Link>
                        <button
                            className="btn btn-outline"
                            style={{ width: '100%' }}
                            onClick={() => setIsRequestModalOpen(true)}
                        >
                            Request New Topic
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

            {isRequestModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Request New Academic Topic</h2>
                            <button onClick={() => setIsRequestModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleRequestSubmit}>
                            <div className={styles.formGroup}>
                                <label>What do you want to request?</label>
                                <select
                                    value={requestType}
                                    onChange={(e) => setRequestType(e.target.value as any)}
                                    className={styles.select}
                                >
                                    <option value="CATEGORY">New Category (e.g. Art & Design)</option>
                                    <option value="SUBJECT">New Subject (within existing category)</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={requestName}
                                    onChange={(e) => setRequestName(e.target.value)}
                                    placeholder="e.g. Quantum Physics"
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Why is this needed? (Optional)</label>
                                <textarea
                                    value={requestDescription}
                                    onChange={(e) => setRequestDescription(e.target.value)}
                                    placeholder="Briefly describe the importance of this topic"
                                    className={styles.textarea}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</button>
                                <LoadingButton
                                    type="submit"
                                    className="btn btn-primary"
                                    isLoading={submitting}
                                    loadingText="Submitting..."
                                >
                                    Submit Request
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TeacherDashboard() {
    return (
        <ProtectedRoute requiredRole="TEACHER">
            <TeacherDashboardContent />
        </ProtectedRoute>
    );
}
