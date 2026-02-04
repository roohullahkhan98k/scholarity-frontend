"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { studentService, Student } from '@/services/studentService';
import DataTable, { Column } from '@/components/admin/DataTable';
import EditStudentModal from '@/components/admin/EditStudentModal';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import toast from 'react-hot-toast';
import { Users, Trash2, BookOpen, Award, Edit } from 'lucide-react';
import styles from './students.module.css';
import { startGlobalLoader, stopGlobalLoader } from '@/components/admin/GlobalLoader';

function StudentsPageContent() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [updating, setUpdating] = useState(false);

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
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getStudents();
            setStudents(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (id: string, name: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Student',
            message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
            onConfirm: () => handleDelete(id),
        });
    };

    const handleDelete = async (id: string) => {
        try {
            setConfirmModal(prev => ({ ...prev, isLoading: true }));
            startGlobalLoader();
            await studentService.deleteStudent(id);
            toast.success('Student deleted successfully');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            await loadStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete student');
            setConfirmModal(prev => ({ ...prev, isLoading: false }));
        } finally {
            stopGlobalLoader();
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
            setUpdating(true);
            startGlobalLoader();
            await studentService.updateStudent(id, data);
            toast.success('Student updated successfully');
            await loadStudents();
            setEditingStudent(null);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update student');
        } finally {
            setUpdating(false);
            stopGlobalLoader();
        }
    };

    const totalEnrolled = students.reduce((acc, s) => acc + s.enrolledCourses, 0);
    const totalCompleted = students.reduce((acc, s) => acc + s.completedCourses, 0);

    const columns: Column<Student>[] = [
        {
            key: 'name',
            header: 'Student',
            width: '25%',
            render: (row) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--secondary-color)', marginBottom: '0.25rem' }}>
                        {row.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {row.email}
                    </div>
                </div>
            ),
        },
        {
            key: 'interests',
            header: 'Interests',
            width: '35%',
            render: (row) => (
                <div style={{
                    maxWidth: '400px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--text-secondary)'
                }}>
                    {row.interests}
                </div>
            ),
        },
        {
            key: 'enrolledCourses',
            header: 'Enrolled',
            width: '12%',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} color="var(--primary-color)" />
                    <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>
                        {row.enrolledCourses}
                    </span>
                </div>
            ),
        },
        {
            key: 'completedCourses',
            header: 'Completed',
            width: '13%',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} color="#10b981" />
                    <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>
                        {row.completedCourses}
                    </span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '15%',
            render: (row) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setEditingStudent(row)}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            border: '1px solid var(--primary-color)',
                            borderRadius: 'var(--radius-md)',
                            background: 'white',
                            color: 'var(--primary-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-color)';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'var(--primary-color)';
                        }}
                    >
                        <Edit size={14} />
                        Edit
                    </button>
                    <button
                        onClick={() => openDeleteModal(row.id, row.name)}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            border: '1px solid #dc2626',
                            borderRadius: 'var(--radius-md)',
                            background: 'white',
                            color: '#dc2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#dc2626';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#dc2626';
                        }}
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div className={styles.titleSection}>
                    <div className={styles.iconWrapper}>
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Students</h1>
                        <p className={styles.subtitle}>Manage student profiles and progress</p>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.statsCompact}>
                        <div className={styles.statItem}>
                            <span className={styles.statNum}>-</span>
                            <span className={styles.statText}>Total</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNum}>-</span>
                            <span className={styles.statText}>Enrolled</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNum}>-</span>
                            <span className={styles.statText}>Completed</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.statsCompact}>
                        <div className={styles.statItem}>
                            <span className={styles.statNum}>{students.length}</span>
                            <span className={styles.statText}>Total</span>
                        </div>
                        <div className={`${styles.statItem} ${styles.warning}`}>
                            <span className={styles.statNum}>{totalEnrolled}</span>
                            <span className={styles.statText}>Enrolled</span>
                        </div>
                        <div className={`${styles.statItem} ${styles.success}`}>
                            <span className={styles.statNum}>{totalCompleted}</span>
                            <span className={styles.statText}>Completed</span>
                        </div>
                    </div>
                )}
            </div>

            <DataTable
                columns={columns}
                data={students}
                loading={loading}
                emptyMessage="No students found."
                pageSize={10}
            />

            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    onClose={() => setEditingStudent(null)}
                    onSave={handleUpdate}
                    loading={updating}
                />
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDanger={true}
                confirmText="Yes, Delete"
                isLoading={confirmModal.isLoading}
            />
        </div>
    );
}

export default function StudentsPage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <StudentsPageContent />
        </ProtectedRoute>
    );
}
