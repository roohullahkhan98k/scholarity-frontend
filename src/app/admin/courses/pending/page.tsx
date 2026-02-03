"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { adminService } from '@/services/adminService';
import DataTable, { Column } from '@/components/admin/DataTable';
import { TrendingUp, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';
import { Course } from '@/services/courseService';
import styles from './pending.module.css';

function PendingCoursesPageContent() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await adminService.getPendingCourses();
            setCourses(data.courses || data); // Handle both wrapped and unwrapped response
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load pending courses');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Are you sure you want to approve this course?')) return;
        try {
            await adminService.approveCourse(id);
            await loadCourses();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to approve course');
        }
    };

    const handleReject = async (id: string) => {
        if (!rejectReason) {
            alert('Please provide a reason for rejection');
            return;
        }
        try {
            await adminService.rejectCourse(id, rejectReason);
            setRejectingId(null);
            setRejectReason('');
            await loadCourses();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reject course');
        }
    };

    const columns: Column<any>[] = [
        {
            key: 'title',
            header: 'Course',
            width: '30%',
            render: (row) => (
                <div className={styles.courseInfo}>
                    <img src={row.thumbnail} alt={row.title} className={styles.thumbnail} />
                    <div className={styles.courseText}>
                        <div className={styles.courseTitle}>{row.title}</div>
                        <div className={styles.courseCategory}>{row.category?.name} • {row.subject?.name}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'teacher',
            header: 'Instructor',
            width: '20%',
            render: (row) => (
                <div className={styles.teacherInfo}>
                    <div className={styles.teacherName}>{row.teacher?.name}</div>
                    <div className={styles.teacherEmail}>{row.teacher?.email}</div>
                </div>
            )
        },
        {
            key: 'price',
            header: 'Price',
            width: '10%',
            render: (row) => <span>${row.price}</span>
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '40%',
            render: (row) => (
                <div className={styles.actions}>
                    <button onClick={() => handleApprove(row.id)} className={styles.approveBtn}>
                        <CheckCircle size={16} />
                        <span>Approve</span>
                    </button>

                    {rejectingId === row.id ? (
                        <div className={styles.rejectBox}>
                            <input
                                type="text"
                                placeholder="Reason..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className={styles.rejectInput}
                            />
                            <button onClick={() => handleReject(row.id)} className={styles.confirmRejectBtn}>Go</button>
                            <button onClick={() => setRejectingId(null)} className={styles.cancelBtn}>X</button>
                        </div>
                    ) : (
                        <button onClick={() => setRejectingId(row.id)} className={styles.rejectBtn}>
                            <XCircle size={16} />
                            <span>Reject</span>
                        </button>
                    )}

                    <button className={styles.viewBtn}>
                        <Eye size={16} />
                        <span>Preview</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <div className={styles.iconWrapper}>
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Course Review</h1>
                        <p className={styles.subtitle}>Review and moderate pending course submissions</p>
                    </div>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <DataTable
                columns={columns}
                data={courses}
                loading={loading}
                emptyMessage="No pending courses to review."
                pageSize={10}
            />
        </div>
    );
}

export default function PendingCoursesPage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <PendingCoursesPageContent />
        </ProtectedRoute>
    );
}
