"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { adminService } from '@/services/adminService';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import {
    CheckCircle, XCircle, ArrowLeft, BookOpen,
    Video, FileText, Clock, DollarSign, Calendar,
    AlertCircle
} from 'lucide-react';
import styles from './course-detail.module.css';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function AdminCourseDetailPageContent() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [course, setCourse] = useState<any | null>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Reject Modal
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [courseData, logsData] = await Promise.all([
                courseService.getCourse(id),
                adminService.getCourseLogs(id)
            ]);
            setCourse(courseData);
            setLogs(logsData);
        } catch (error) {
            toast.error('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!confirm('Approve this course? It will become live immediately.')) return;

        try {
            setActionLoading(true);
            await adminService.approveCourse(id);
            toast.success('Course Approved!');
            loadData(); // Refresh to see status update
        } catch (error) {
            toast.error('Failed to approve course');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return toast.error('Reason is required');

        try {
            setActionLoading(true);
            await adminService.rejectCourse(id, rejectReason);
            toast.success('Course Rejected');
            setShowRejectModal(false);
            setRejectReason('');
            loadData();
        } catch (error) {
            toast.error('Failed to reject course');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading course details...</div>;
    if (!course) return <div className="p-8 text-center">Course not found</div>;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className={styles.titleSection}>
                        <h1>{course.title}</h1>
                        <div className={styles.badges}>
                            <span className={`${styles.badge} ${styles[`status${course.status?.charAt(0) + course.status?.slice(1).toLowerCase()}`]}`}>
                                {course.status}
                            </span>
                            <span className={`${styles.badge} ${styles.categoryBadge}`}>
                                {course.category?.name} • {course.subject?.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}><BookOpen size={20} /> Course Overview</h2>
                <div className={styles.infoGrid}>
                    <div>
                        <p className={styles.description}>{course.description}</p>
                        {course.thumbnail && (
                            <div className="mt-4">
                                <p className={styles.label}>Thumbnail Preview</p>
                                <img src={course.thumbnail} alt="Thumbnail" className={styles.thumbnailImage} />
                            </div>
                        )}
                    </div>
                    <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Price</span>
                            <span className={styles.value}>${course.price}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Created By</span>
                            <span className={styles.value}>{course.teacher?.name}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Email</span>
                            <span className="text-sm truncate">{course.teacher?.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}><Video size={20} /> Curriculum Content</h2>
                {(!course.units || course.units.length === 0) ? (
                    <p className="text-slate-500 italic">No curriculum yet.</p>
                ) : (
                    course.units.map((unit: any, i: number) => (
                        <div key={unit.id} className={styles.unit}>
                            <div className={styles.unitHeader}>
                                Unit {i + 1}: {unit.title}
                            </div>
                            <div>
                                {unit.lessons?.map((lesson: any, j: number) => (
                                    <div key={lesson.id} className={styles.lesson}>
                                        <div className={styles.lessonHeader}>
                                            <span className="text-slate-400 font-mono text-sm">{(i + 1)}.{j + 1}</span>
                                            {lesson.type === 'VIDEO' ? <Video size={16} className="text-blue-500" /> : <FileText size={16} className="text-orange-500" />}
                                            <span>{lesson.title}</span>
                                            <span className={styles.lessonType}>{lesson.type}</span>
                                        </div>

                                        {/* Primary Video */}
                                        {lesson.videoUrl && (
                                            <div className="ml-8 text-sm text-slate-500 flex items-center gap-2">
                                                <Video size={14} />
                                                <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-md">
                                                    {lesson.videoUrl}
                                                </a>
                                                <span className="text-xs bg-slate-100 px-1 rounded">Primary</span>
                                            </div>
                                        )}

                                        {/* Resources / Secondary Content */}
                                        {lesson.resources && lesson.resources.length > 0 && (
                                            <div className={styles.lessonResources}>
                                                {lesson.resources.map((res: any, k: number) => (
                                                    <a key={k} href={res.url} target="_blank" rel="noreferrer" className={styles.resourceTag}>
                                                        {res.type === 'VIDEO' ? <Video size={12} /> : <FileText size={12} />}
                                                        {res.title || 'Resource'}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Logs */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}><Clock size={20} /> Approval History</h2>
                {logs.length === 0 ? (
                    <p className="text-slate-500">No history available.</p>
                ) : (
                    <div>
                        {logs.map((log, idx) => (
                            <div key={idx} className={styles.logItem}>
                                <div className={styles.logMeta}>
                                    <div>{format(new Date(log.createdAt), 'MMM d, yyyy')}</div>
                                    <div className="text-xs text-slate-400">{format(new Date(log.createdAt), 'h:mm a')}</div>
                                </div>
                                <div className={styles.logContent}>
                                    <div className={`${styles.logAction} ${log.action === 'APPROVED' ? 'text-green-600' :
                                            log.action === 'REJECTED' ? 'text-red-600' : 'text-blue-600'
                                        }`}>
                                        {log.action}
                                    </div>
                                    {log.comment && (
                                        <div className={styles.logComment}>
                                            <AlertCircle size={16} className="inline mr-2" />
                                            {log.comment}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className={styles.fixedFooter}>
                <button
                    onClick={() => setShowRejectModal(true)}
                    className={styles.rejectBtn}
                    disabled={actionLoading}
                >
                    <XCircle size={18} /> Reject
                </button>
                <button
                    onClick={handleApprove}
                    className={styles.approveBtn}
                    disabled={actionLoading}
                >
                    <CheckCircle size={18} /> Approve
                </button>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <>
                    <div className={styles.overlay} onClick={() => setShowRejectModal(false)} />
                    <div className={styles.rejectDialog}>
                        <h3 className="text-lg font-bold mb-2">Reject Course</h3>
                        <p className="text-slate-500 text-sm">Please provide a reason so the teacher can improve.</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className={styles.textarea}
                            placeholder="e.g. Video quality in Unit 2 is too low..."
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 rounded text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <LoadingButton
                                onClick={handleReject}
                                isLoading={actionLoading}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Reject Course
                            </LoadingButton>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function AdminCourseDetailPage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <AdminCourseDetailPageContent />
        </ProtectedRoute>
    );
}
