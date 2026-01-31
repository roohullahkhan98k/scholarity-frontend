"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { instructorService, InstructorApplication } from '@/services/instructorService';
import { ApplicationStatus } from '@/types';
import DataTable, { Column } from '@/components/admin/DataTable';
import ApplicationModal from '@/components/admin/ApplicationModal';
import { FileText, Filter, Eye } from 'lucide-react';
import styles from './applications.module.css';

function ApplicationsPageContent() {
    const [applications, setApplications] = useState<InstructorApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<InstructorApplication | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await instructorService.getApplications();
            setApplications(data.applications || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id: string, status: ApplicationStatus) => {
        try {
            setProcessingId(id);
            await instructorService.reviewApplication(id, status);
            await loadApplications();
            setSelectedApplication(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to review application');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredApplications = filter === 'ALL'
        ? applications
        : applications.filter(app => app.status === filter);

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'PENDING').length,
        approved: applications.filter(a => a.status === 'APPROVED').length,
        rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    const columns: Column<InstructorApplication>[] = [
        {
            key: 'name',
            header: 'Name',
            width: '30%',
            render: (row) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--secondary-color)', marginBottom: '0.25rem' }}>
                        {row.user.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {row.user.email}
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            width: '20%',
            render: (row) => {
                const statusStyles = {
                    PENDING: { color: '#f59e0b', bg: '#fef3c7' },
                    APPROVED: { color: '#10b981', bg: '#d1fae5' },
                    REJECTED: { color: '#ef4444', bg: '#fee2e2' },
                };
                const style = statusStyles[row.status as keyof typeof statusStyles];
                return (
                    <span style={{
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: style.color,
                        backgroundColor: style.bg,
                    }}>
                        {row.status}
                    </span>
                );
            },
        },
        {
            key: 'createdAt',
            header: 'Applied Date',
            width: '25%',
            render: (row) => (
                <span style={{ color: 'var(--text-secondary)' }}>
                    {new Date(row.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '25%',
            render: (row) => (
                <button
                    onClick={() => setSelectedApplication(row)}
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
                    <Eye size={14} />
                    View Details
                </button>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div className={styles.titleSection}>
                    <div className={styles.iconWrapper}>
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Instructor Applications</h1>
                        <p className={styles.subtitle}>Review and manage instructor applications</p>
                    </div>
                </div>

                <div className={styles.statsCompact}>
                    <div className={styles.statItem}>
                        <span className={styles.statNum}>{stats.total}</span>
                        <span className={styles.statText}>Total</span>
                    </div>
                    <div className={`${styles.statItem} ${styles.pending}`}>
                        <span className={styles.statNum}>{stats.pending}</span>
                        <span className={styles.statText}>Pending</span>
                    </div>
                    <div className={`${styles.statItem} ${styles.approved}`}>
                        <span className={styles.statNum}>{stats.approved}</span>
                        <span className={styles.statText}>Approved</span>
                    </div>
                    <div className={`${styles.statItem} ${styles.rejected}`}>
                        <span className={styles.statNum}>{stats.rejected}</span>
                        <span className={styles.statText}>Rejected</span>
                    </div>
                </div>
            </div>

            <div className={styles.filterSection}>
                <div className={styles.filterHeader}>
                    <Filter size={16} />
                    <span>Filter</span>
                </div>
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'ALL' ? styles.active : ''}`}
                        onClick={() => setFilter('ALL')}
                    >
                        All
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'PENDING' ? styles.active : ''}`}
                        onClick={() => setFilter('PENDING')}
                    >
                        Pending
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'APPROVED' ? styles.active : ''}`}
                        onClick={() => setFilter('APPROVED')}
                    >
                        Approved
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'REJECTED' ? styles.active : ''}`}
                        onClick={() => setFilter('REJECTED')}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <DataTable
                columns={columns}
                data={filteredApplications}
                loading={loading}
                emptyMessage="No applications found."
                pageSize={10}
            />

            {selectedApplication && (
                <ApplicationModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onApprove={(id) => handleReview(id, 'APPROVED')}
                    onReject={(id) => handleReview(id, 'REJECTED')}
                    loading={processingId === selectedApplication.id}
                />
            )}
        </div>
    );
}

export default function ApplicationsPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <ApplicationsPageContent />
        </ProtectedRoute>
    );
}
