"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { courseService } from '@/services/courseService';
import { Course, Unit, Lesson } from '@/types';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import toast from 'react-hot-toast';
import {
    BookOpen, ArrowLeft, Clock, FileText, Video,
    Link as LinkIcon, Download, Trash2, Edit, Power, ChevronDown, ChevronRight, Play, ExternalLink, Plus, AlertCircle, MoreVertical
} from 'lucide-react';
import AdminEditCourseModal from '@/components/admin/AdminEditCourseModal';
import AdminAddUnitModal from '@/components/admin/AdminAddUnitModal';
import AdminAddLessonModal from '@/components/admin/AdminAddLessonModal';
import AdminEditLessonModal from '@/components/admin/AdminEditLessonModal';
import CourseVideoPlayer from '@/components/CourseVideoPlayer';
import Link from 'next/link';
import { getFileUrl } from '@/lib/utils';
import { startGlobalLoader, stopGlobalLoader } from '@/components/admin/GlobalLoader';

export default function CourseDetailPage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <CourseDetailsContent />
        </ProtectedRoute>
    );
}

function CourseDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    // Modal States
    const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
    const [activeUnitForLesson, setActiveUnitForLesson] = useState<string | null>(null);
    const [lessonToEdit, setLessonToEdit] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isLoading?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isLoading: false,
    });

    useEffect(() => {
        if (courseId) {
            fetchData();
        }
    }, [courseId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await courseService.getCourse(courseId);
            setCourse(data);
            if (data.units) {
                const initialExpanded: Record<string, boolean> = {};
                data.units.forEach((u: any) => initialExpanded[u.id] = true);
                setExpandedUnits(initialExpanded);
            }
        } catch (error: any) {
            toast.error('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const toggleUnit = (unitId: string) => {
        setExpandedUnits(prev => ({
            ...prev,
            [unitId]: !prev[unitId]
        }));
    };

    const handleToggleStatus = async () => {
        if (!course) return;
        try {
            setActionLoading(true);
            startGlobalLoader();
            const result = await courseService.toggleStatus(course.id);
            setCourse({ ...course, status: result.status });
            toast.success(`Course ${result.status === 'APPROVED' ? 'activated' : 'deactivated'}`);
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setActionLoading(false);
            stopGlobalLoader();
        }
    };

    const handleDeleteCourse = async () => {
        if (!course) return;
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            startGlobalLoader();
            await courseService.deleteCourse(course.id);
            toast.success('Course deleted');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            router.push('/admin/dashboard');
        } catch (error: any) {
            toast.error('Failed to delete course');
        } finally {
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
            stopGlobalLoader();
        }
    };

    const confirmDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Course',
            message: `Are you sure you want to delete "${course?.title}"? This action cannot be undone.`,
            onConfirm: handleDeleteCourse,
        });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner"></div>
                <style jsx>{`
                    .spinner {
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid var(--primary-color);
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!course) return <div style={{ padding: '2rem' }}>Course not found.</div>;

    const statusColor = getStatusColor(course.status);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', background: '#f9fafb', minHeight: '100vh' }}>
            <button
                onClick={() => router.back()}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500
                }}
            >
                <ArrowLeft size={16} />
                Back to Courses
            </button>

            {/* Header Section */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                gap: '2.5rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                alignItems: 'flex-start'
            }}>
                {/* Thumbnail Display */}
                <div style={{
                    width: '320px',
                    height: '200px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: '#1f2937',
                    position: 'relative',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {course.thumbnail ? (
                        <img
                            src={getFileUrl(course.thumbnail)}
                            alt={course.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#9ca3af', gap: '0.5rem' }}>
                            <BookOpen size={48} />
                            <span>No Thumbnail</span>
                        </div>
                    )}
                </div>

                {/* Info Block */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '6px',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        background: statusColor.bg,
                                        color: statusColor.text,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        border: `1px solid ${statusColor.text}20`
                                    }}>
                                        {course.status}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Ref: #{course.id.slice(-6).toUpperCase()}</span>
                                </div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.75rem 0', lineHeight: 1.2 }}>
                                    {course.title}
                                </h1>
                                <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0', lineHeight: '1.6', maxWidth: '600px' }}>
                                    {course.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: 'white',
                                        color: '#374151',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <Edit size={16} />
                                    Edit Course
                                </button>
                                <button
                                    onClick={handleToggleStatus}
                                    disabled={actionLoading}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                                        background: course.status === 'APPROVED' ? '#fff1f2' : '#f0fdf4',
                                        color: course.status === 'APPROVED' ? '#e11d48' : '#15803d',
                                        border: '1px solid',
                                        borderColor: course.status === 'APPROVED' ? '#fecdd3' : '#bbf7d0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        opacity: actionLoading ? 0.7 : 1,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {actionLoading ? <div className="spinner-sm" /> : <Power size={16} />}
                                    {course.status === 'APPROVED' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        background: 'white',
                                        color: '#e11d48',
                                        border: '1px solid #fee2e2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem',
                        padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>Category</div>
                            <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '0.25rem' }}>{course.category?.name || 'Uncategorized'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>Price</div>
                            <div style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.125rem', marginTop: '0.25rem' }}>
                                {course.price > 0 ? `$${course.price}` : 'Free'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>Instructor</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%', background: '#3b82f6', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600
                                }}>
                                    {course.teacher?.user?.name?.charAt(0) || 'T'}
                                </div>
                                <span style={{ fontWeight: 600, color: '#1e293b' }}>
                                    {course.teacher?.user?.name || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Player Section */}
            {activeVideo && (
                <div style={{ marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ background: '#111827', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Video size={20} /> Now Playing
                        </span>
                        <button onClick={() => setActiveVideo(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>Close Player</button>
                    </div>
                    <CourseVideoPlayer url={activeVideo} />
                </div>
            )}

            {/* Content Section */}
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <BookOpen className="text-blue-600" />
                        Course Content
                    </h2>
                    <button
                        onClick={() => setIsAddUnitOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: '#1e293b', color: 'white', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Plus size={18} /> Add Unit
                    </button>
                </div>

                {!course.units || course.units.length === 0 ? (
                    <div style={{ padding: '3rem', background: 'white', borderRadius: '16px', textAlign: 'center', color: '#6b7280', border: '1px dashed #e5e7eb' }}>
                        <div style={{ marginBottom: '1rem' }}><FileText size={48} opacity={0.3} /></div>
                        No units available for this course.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {course.units.map((unit: any) => (
                            <div key={unit.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1rem', background: '#f8fafc' }}>
                                    <button
                                        onClick={() => toggleUnit(unit.id)}
                                        style={{ flex: 1, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    >
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, background: '#e2e8f0', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>UNIT {unit.order}</span>
                                            {unit.title}
                                        </h3>
                                        {expandedUnits[unit.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </button>
                                    <button
                                        onClick={() => setActiveUnitForLesson(unit.id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.8rem', background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                                    >
                                        <Plus size={16} /> Add Lesson
                                    </button>
                                </div>

                                {expandedUnits[unit.id] && (
                                    <div style={{ padding: '0.5rem 0' }}>
                                        {unit.lessons?.map((lesson: any) => (
                                            <div key={lesson.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: lesson.type === 'VIDEO' ? '#eff6ff' : '#fff7ed', color: lesson.type === 'VIDEO' ? '#2563eb' : '#ea580c' }}>
                                                            {lesson.type === 'VIDEO' ? <Video size={18} /> : <FileText size={18} />}
                                                        </div>
                                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{lesson.title}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {(lesson.videoUrl || lesson.url) && lesson.type === 'VIDEO' && (
                                                            <button onClick={() => setActiveVideo(lesson.videoUrl || lesson.url)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Watch</button>
                                                        )}
                                                        <button onClick={() => setLessonToEdit(lesson)} style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }}><Edit size={16} /></button>
                                                    </div>
                                                </div>
                                                {/* Resources */}
                                                {lesson.resources?.length > 0 && (
                                                    <div style={{ marginTop: '0.75rem', paddingLeft: '3.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        {lesson.resources.map((res: any, idx: number) => (
                                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{res.title}</div>
                                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                                    <a href={getFileUrl(res.url)} target="_blank" rel="noopener" style={{ color: '#2563eb', fontSize: '0.75rem' }}>View</a>
                                                                    {['PDF', 'NOTE', 'SYLLABUS'].includes(res.type) && <a href={getFileUrl(res.url)} download style={{ color: '#2563eb', fontSize: '0.75rem' }}>Download</a>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {isEditModalOpen && <AdminEditCourseModal course={course} onClose={() => setIsEditModalOpen(false)} onSuccess={fetchData} />}
            {isAddUnitOpen && <AdminAddUnitModal courseId={course.id} onClose={() => setIsAddUnitOpen(false)} onSuccess={fetchData} nextOrder={(course.units?.length || 0) + 1} />}
            {activeUnitForLesson && <AdminAddLessonModal unitId={activeUnitForLesson} onClose={() => setActiveUnitForLesson(null)} onSuccess={fetchData} nextOrder={(course.units?.find((u: any) => u.id === activeUnitForLesson)?.lessons?.length || 0) + 1} />}
            {lessonToEdit && <AdminEditLessonModal lesson={lessonToEdit} onClose={() => setLessonToEdit(null)} onSuccess={fetchData} />}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDanger={true}
                isLoading={confirmModal.isLoading}
            />
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'APPROVED': return { bg: '#d1fae5', text: '#10b981' };
        case 'PENDING': return { bg: '#fef3c7', text: '#f59e0b' };
        case 'REJECTED': return { bg: '#fee2e2', text: '#ef4444' };
        default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
}
