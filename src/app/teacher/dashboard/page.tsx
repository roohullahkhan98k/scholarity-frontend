"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import styles from './dashboard.module.css';
import { academicService } from '@/services/academicService';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import { X, Plus, BookOpen, Users, DollarSign, Award, ChevronRight, MessageSquarePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import { motion } from 'framer-motion';

function TeacherDashboardContent() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [stats, setStats] = useState({
        activeStudents: 0,
        totalCourses: 0,
        earnings: 0,
        averageRating: 0
    });
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestType, setRequestType] = useState<'CATEGORY' | 'SUBJECT'>('CATEGORY');
    const [requestName, setRequestName] = useState('');
    const [requestDescription, setRequestDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ALL' | 'DRAFT' | 'PENDING' | 'APPROVED'>('ALL');

    const filteredCourses = activeTab === 'ALL'
        ? courses
        : courses.filter(c => c.status === activeTab);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const courseData = await courseService.getMyCourses();
            setCourses(courseData || []);
            // Mock stats for now as per spec
            setStats({
                activeStudents: 0,
                totalCourses: courseData?.length || 0,
                earnings: 0,
                averageRating: 0
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await academicService.createRequest({
                type: requestType,
                name: requestName,
                description: requestDescription
            });
            toast.success('Request submitted for approval! 🚀');
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
                <div>
                    <h1 className={styles.title}>Welcome back, {user?.name}! 👋</h1>
                    <p className={styles.subtitle}>Here's what's happening with your courses today.</p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className={styles.secondaryBtn}
                    >
                        <MessageSquarePlus size={18} />
                        <span>Request Topic</span>
                    </button>
                    <Link href="/teacher/courses/create" className={styles.primaryBtn}>
                        <Plus size={18} />
                        <span>Create Course</span>
                    </Link>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Active Students</div>
                        <div className={styles.statValue}>{stats.activeStudents}</div>
                    </div>
                    <div className={`${styles.statIcon} ${styles.blue}`}>
                        <Users size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Total Courses</div>
                        <div className={styles.statValue}>{stats.totalCourses}</div>
                    </div>
                    <div className={`${styles.statIcon} ${styles.purple}`}>
                        <BookOpen size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Total Earnings</div>
                        <div className={styles.statValue}>${stats.earnings.toLocaleString()}</div>
                    </div>
                    <div className={`${styles.statIcon} ${styles.green}`}>
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Avg. Rating</div>
                        <div className={styles.statValue}>{stats.averageRating.toFixed(1)}</div>
                    </div>
                    <div className={`${styles.statIcon} ${styles.orange}`}>
                        <Award size={24} />
                    </div>
                </div>
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>My Courses</h2>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'ALL' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('ALL')}
                            >
                                All
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'APPROVED' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('APPROVED')}
                            >
                                Live
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'PENDING' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('PENDING')}
                            >
                                Pending
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'DRAFT' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('DRAFT')}
                            >
                                Drafts
                            </button>
                        </div>
                        <Link href="/teacher/courses" className={styles.viewAll}>
                            All Management <ChevronRight size={16} />
                        </Link>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📚</div>
                            <h3>No {activeTab.toLowerCase() === 'all' ? '' : activeTab.toLowerCase()} courses found</h3>
                            <p>
                                {activeTab === 'DRAFT'
                                    ? "You don't have any unfinished drafts."
                                    : activeTab === 'PENDING'
                                        ? "No courses are currently under review."
                                        : "You haven't published any courses yet."}
                            </p>
                            {activeTab === 'ALL' && (
                                <Link href="/teacher/courses/create" className={styles.primaryBtn} style={{ marginTop: '1.5rem' }}>
                                    <Plus size={18} /> Create Your First Course
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className={styles.tableScrollContainer}>
                            <table className={styles.courseList}>
                                <thead className={styles.stickyHeader}>
                                    <tr>
                                        <th className={styles.tableHeader}>Course Title</th>
                                        <th className={styles.tableHeader}>Status</th>
                                        <th className={styles.tableHeader}>Price</th>
                                        <th className={styles.tableHeader}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map((course) => (
                                        <tr key={course.id} className={styles.courseRow}>
                                            <td>
                                                <div className={styles.courseCell}>
                                                    <div className={styles.courseThumb}>
                                                        {course.thumbnail ? (
                                                            <img src={course.thumbnail} alt={course.title} />
                                                        ) : (
                                                            <BookOpen size={18} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className={styles.itemTitle}>{course.title}</span>
                                                        <span className={styles.itemCategory}>Master Class</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`${styles.statusBadge} ${styles[course.status.toLowerCase()]}`}>
                                                    {course.status}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.priceText}>${course.price}</span>
                                            </td>
                                            <td>
                                                <Link
                                                    href={course.status === 'DRAFT' ? `/teacher/courses/create?id=${course.id}` : `/teacher/courses/${course.id}`}
                                                    className={styles.itemAction}
                                                >
                                                    {course.status === 'DRAFT' ? 'Resume' : 'View'}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Reviews</h2>
                        <Link href="/teacher/reviews" className={styles.viewAll}>
                            See All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>⭐</div>
                        <h3>No reviews yet</h3>
                        <p>Reviews from your students will appear here once they start learning.</p>
                    </div>
                </div>
            </div>

            {isRequestModalOpen && (
                <div className={styles.modalOverlay}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.modal}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Request New Academic Topic</h2>
                            <button onClick={() => setIsRequestModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                        </div>
                        <form className={styles.form} onSubmit={handleRequestSubmit}>
                            <div className={styles.formGroup}>
                                <label>Request Type</label>
                                <select
                                    value={requestType}
                                    onChange={(e) => setRequestType(e.target.value as any)}
                                    className={styles.select}
                                >
                                    <option value="CATEGORY">New Category (Art, Music, etc.)</option>
                                    <option value="SUBJECT">New Subject (within a category)</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Topic Name</label>
                                <input
                                    type="text"
                                    value={requestName}
                                    onChange={(e) => setRequestName(e.target.value)}
                                    placeholder="e.g. Quantitative Finance"
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description / Rationale</label>
                                <textarea
                                    value={requestDescription}
                                    onChange={(e) => setRequestDescription(e.target.value)}
                                    placeholder="Explain why this topic should be added to our curriculum..."
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsRequestModalOpen(false)}>Cancel</button>
                                <LoadingButton
                                    type="submit"
                                    className={styles.primaryBtn}
                                    isLoading={submitting}
                                    loadingText="Submitting..."
                                >
                                    Submit Request
                                </LoadingButton>
                            </div>
                        </form>
                    </motion.div>
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
