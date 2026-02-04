"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { courseService } from '@/services/courseService';
import { teacherService, Teacher } from '@/services/teacherService';
import { Course } from '@/types';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import toast from 'react-hot-toast';
import { BookOpen, ArrowLeft, Trash2, Power, Search, Check, Minus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { startGlobalLoader, stopGlobalLoader } from '@/components/admin/GlobalLoader';
import { getFileUrl } from '@/lib/utils';
import BulkActionBar, { BulkAction } from '@/components/BulkActionBar/BulkActionBar';
import styles from './courses.module.css';

export default function TeacherCoursesPage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <TeacherCoursesContent />
        </ProtectedRoute>
    );
}

function TeacherCoursesContent() {
    const params = useParams();
    const router = useRouter();
    const teacherId = params.teacherId as string;

    const [courses, setCourses] = useState<Course[]>([]);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isLoading?: boolean;
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isLoading: false,
    });

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Selection State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Initial fetch
    useEffect(() => {
        if (teacherId) {
            fetchTeacher();
        }
    }, [teacherId]);

    // Search fetch
    useEffect(() => {
        if (teacherId) {
            fetchCourses();
            setSelectedIds([]); // Clear selection on search
        }
    }, [teacherId, debouncedSearch]);

    const fetchTeacher = async () => {
        try {
            const teacherData = await teacherService.getTeacher(teacherId);
            setTeacher(teacherData);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCourses = async () => {
        try {
            setIsSearching(true);
            const coursesData = await courseService.getAdminCourses({ teacherId, search: debouncedSearch });
            setCourses(coursesData);
        } catch (error: any) {
            toast.error('Failed to load courses');
        } finally {
            setIsSearching(false);
            setLoading(false);
        }
    };

    const toggleSelection = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAllToggle = () => {
        if (selectedIds.length === courses.length && courses.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(courses.map(c => c.id));
        }
    };

    const handleBulkDelete = async () => {
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            startGlobalLoader();
            await courseService.bulkDeleteCourses({ courseIds: selectedIds });
            toast.success(`${selectedIds.length} courses deleted`);
            setCourses(prev => prev.filter(c => !selectedIds.includes(c.id)));
            setSelectedIds([]);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error: any) {
            toast.error('Bulk deletion failed');
        } finally {
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
            stopGlobalLoader();
        }
    };

    const handleDeleteAll = async () => {
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            startGlobalLoader();
            await courseService.bulkDeleteCourses({ deleteAll: true });
            toast.success('All courses deleted');
            setCourses([]);
            setSelectedIds([]);
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error: any) {
            toast.error('Failed to delete all courses');
        } finally {
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
            stopGlobalLoader();
        }
    };

    const confirmBulkDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Bulk Delete',
            message: `Are you sure you want to delete ${selectedIds.length} selected courses? This cannot be undone.`,
            onConfirm: handleBulkDelete,
        });
    };

    const confirmDeleteAll = () => {
        setConfirmModal({
            isOpen: true,
            title: 'DELETE ALL COURSES',
            message: `WARNING: This will permanently delete EVERY course in the system. Are you absolutely sure?`,
            onConfirm: handleDeleteAll,
            confirmText: 'YES, DELETE EVERYTHING'
        });
    };

    const handleDelete = async (courseId: string) => {
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            startGlobalLoader();
            await courseService.deleteCourse(courseId);
            toast.success('Course deleted');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            setCourses(prev => prev.filter(c => c.id !== courseId));
            setSelectedIds(prev => prev.filter(id => id !== courseId));
        } catch (error: any) {
            toast.error('Failed to delete course');
        } finally {
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
            stopGlobalLoader();
        }
    };

    const confirmDelete = (course: Course) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Course',
            message: `Are you sure you want to delete "${course.title}"?`,
            onConfirm: () => handleDelete(course.id),
        });
    };

    const handleToggleStatus = async (course: Course) => {
        try {
            setActionLoading(course.id);
            startGlobalLoader();
            const result = await courseService.toggleStatus(course.id);
            setCourses(prev => prev.map(c =>
                c.id === course.id ? { ...c, status: result.status as any } : c
            ));
            toast.success(`Course ${result.status === 'APPROVED' ? 'activated' : 'deactivated'}`);
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setActionLoading(null);
            stopGlobalLoader();
        }
    };

    const handleCardClick = (id: string) => {
        if (selectedIds.length > 0) {
            setSelectedIds(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
        } else {
            router.push(`/admin/courses/${id}`);
        }
    };

    const bulkActions: BulkAction[] = [
        {
            label: 'Delete Selected',
            onClick: confirmBulkDelete,
            icon: <Trash2 size={18} />,
            variant: 'danger'
        }
    ];

    // Only add 'Delete All' for Super Admins
    if (courses.length > 0) {
        bulkActions.push({
            label: 'Delete All Courses',
            onClick: confirmDeleteAll,
            variant: 'danger'
        });
    }

    if (loading && !isSearching) {
        return (
            <div className={styles.pageContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className={styles.titleArea}>
                    <div className={styles.iconBox}>
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Courses by {teacher?.name}</h1>
                        <p className={styles.subtitle}>Review and manage courses for this instructor</p>
                    </div>
                </div>

                {/* Search Bar & Selection Controls */}
                <div className={styles.controlsRow}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Filter courses by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                        {isSearching && (
                            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                                <div className="spinner-sm" />
                            </div>
                        )}
                    </div>

                    {courses.length > 0 && (
                        <button
                            className={`${styles.selectAllBtn} ${selectedIds.length === courses.length ? styles.active : ''}`}
                            onClick={handleSelectAllToggle}
                        >
                            {selectedIds.length === courses.length ? 'Deselect All' : 'Select All'}
                            <div className={styles.selectionDot}>
                                {selectedIds.length > 0 && selectedIds.length < courses.length && <Minus size={12} strokeWidth={4} />}
                                {selectedIds.length === courses.length && <Check size={12} strokeWidth={4} />}
                            </div>
                        </button>
                    )}
                </div>
            </header>

            {/* Course Grid */}
            {courses.length === 0 && !isSearching ? (
                <div className={styles.emptyState}>
                    <BookOpen size={48} color="#94a3b8" />
                    <h3 className={styles.emptyTitle}>No courses found</h3>
                    <p className={styles.emptySubtitle}>We couldn't find any courses matching your search.</p>
                </div>
            ) : (
                <div className={styles.courseGrid} style={{ opacity: isSearching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    {courses.map(course => {
                        const isSelected = selectedIds.includes(course.id);
                        return (
                            <div
                                key={course.id}
                                className={`${styles.courseCard} ${isSelected ? styles.selectedCard : ''}`}
                                onClick={() => handleCardClick(course.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.thumbnailArea}>
                                    <div
                                        className={`${styles.selectionCheckbox} ${isSelected ? styles.selected : ''}`}
                                        onClick={(e) => toggleSelection(e, course.id)}
                                    >
                                        {isSelected && <Check size={14} color="white" strokeWidth={3} />}
                                    </div>
                                    <img
                                        src={getFileUrl(course.thumbnail) || '/placeholder-course.jpg'}
                                        alt=""
                                        className={styles.thumbnail}
                                    />
                                    <div className={styles.statusBadge} style={{
                                        background: getStatusColor(course.status).bg,
                                        color: getStatusColor(course.status).text
                                    }}>
                                        {course.status}
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.category}>{course.category?.name || 'Academic'}</div>
                                    <h3 className={styles.courseTitle}>{course.title}</h3>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>#{course.id.slice(-6).toUpperCase()}</span>
                                        <span className={styles.price}>{course.price > 0 ? `$${course.price}` : 'Free'}</span>
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(course); }}
                                            disabled={actionLoading === course.id}
                                            className={`${styles.actionBtn} ${course.status === 'APPROVED' ? styles.disableBtn : styles.approveBtn}`}
                                        >
                                            <Power size={16} />
                                            {course.status === 'APPROVED' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); confirmDelete(course); }}
                                            className={styles.deleteBtn}
                                            title="Delete Course"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reusable Bulk Action Bar */}
            <BulkActionBar
                selectedCount={selectedIds.length}
                actions={bulkActions}
                onCancel={() => setSelectedIds([])}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDanger={true}
                confirmText={confirmModal.confirmText || "Yes, Delete"}
                isLoading={confirmModal.isLoading}
            />
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'APPROVED': return { bg: 'rgba(34, 197, 94, 0.9)', text: '#fff' };
        case 'PENDING': return { bg: 'rgba(234, 179, 8, 0.9)', text: '#fff' };
        case 'REJECTED': return { bg: 'rgba(239, 68, 68, 0.9)', text: '#fff' };
        default: return { bg: 'rgba(100, 116, 139, 0.9)', text: '#fff' };
    }
}
