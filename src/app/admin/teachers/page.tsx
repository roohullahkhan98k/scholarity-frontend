"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { teacherService, Teacher } from '@/services/teacherService';
import DataTable, { Column } from '@/components/admin/DataTable';
import EditTeacherModal from '@/components/admin/EditTeacherModal';
import { GraduationCap, Star, Trash2, Users, Edit } from 'lucide-react';
import styles from './teachers.module.css';

function TeachersPageContent() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        try {
            setLoading(true);
            const data = await teacherService.getTeachers();
            setTeachers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load teachers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            return;
        }

        try {
            setDeletingId(id);
            await teacherService.deleteTeacher(id);
            await loadTeachers();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete teacher');
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdate = async (id: string, data: any) => {
        try {
            setUpdating(true);
            await teacherService.updateTeacher(id, data);
            await loadTeachers();
            setEditingTeacher(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update teacher');
        } finally {
            setUpdating(false);
        }
    };

    const totalStudents = teachers.reduce((acc, t) => acc + t.totalStudents, 0);
    const avgRating = teachers.length > 0
        ? (teachers.reduce((acc, t) => acc + t.rating, 0) / teachers.length).toFixed(1)
        : '0.0';

    const columns: Column<Teacher>[] = [
        {
            key: 'name',
            header: 'Teacher',
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
            key: 'expertise',
            header: 'Expertise',
            width: '30%',
            render: (row) => (
                <div style={{
                    maxWidth: '350px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--text-secondary)'
                }}>
                    {row.expertise}
                </div>
            ),
        },
        {
            key: 'rating',
            header: 'Rating',
            width: '15%',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>
                        {row.rating.toFixed(1)}
                    </span>
                </div>
            ),
        },
        {
            key: 'totalStudents',
            header: 'Students',
            width: '12%',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} color="var(--primary-color)" />
                    <span style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>
                        {row.totalStudents}
                    </span>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            width: '13%',
            render: (row) => {
                if (!row.applicationStatus) return null;
                const isPending = row.applicationStatus === 'PENDING';
                return (
                    <span style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: isPending ? '#f59e0b' : '#10b981',
                        backgroundColor: isPending ? '#fef3c7' : '#d1fae5',
                    }}>
                        {row.applicationStatus}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '15%',
            render: (row) => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setEditingTeacher(row)}
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
                        onClick={() => handleDelete(row.id, row.name)}
                        disabled={deletingId === row.id}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            border: '1px solid #dc2626',
                            borderRadius: 'var(--radius-md)',
                            background: 'white',
                            color: '#dc2626',
                            cursor: deletingId === row.id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: deletingId === row.id ? 0.5 : 1,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            if (deletingId !== row.id) {
                                e.currentTarget.style.background = '#dc2626';
                                e.currentTarget.style.color = 'white';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (deletingId !== row.id) {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#dc2626';
                            }
                        }}
                    >
                        <Trash2 size={14} />
                        {deletingId === row.id ? 'Deleting...' : 'Delete'}
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
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Teachers</h1>
                        <p className={styles.subtitle}>Manage teacher profiles and applications</p>
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
                            <span className={styles.statText}>Avg Rating</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNum}>-</span>
                            <span className={styles.statText}>Students</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.statsCompact}>
                        <div className={styles.statItem}>
                            <span className={styles.statNum}>{teachers.length}</span>
                            <span className={styles.statText}>Total</span>
                        </div>
                        <div className={`${styles.statItem} ${styles.warning}`}>
                            <span className={styles.statNum}>{avgRating}</span>
                            <span className={styles.statText}>Avg Rating</span>
                        </div>
                        <div className={`${styles.statItem} ${styles.success}`}>
                            <span className={styles.statNum}>{totalStudents}</span>
                            <span className={styles.statText}>Students</span>
                        </div>
                    </div>
                )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <DataTable
                columns={columns}
                data={teachers}
                loading={loading}
                emptyMessage="No teachers found."
                pageSize={10}
            />

            {editingTeacher && (
                <EditTeacherModal
                    teacher={editingTeacher}
                    onClose={() => setEditingTeacher(null)}
                    onSave={handleUpdate}
                    loading={updating}
                />
            )}
        </div>
    );
}

export default function TeachersPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <TeachersPageContent />
        </ProtectedRoute>
    );
}
