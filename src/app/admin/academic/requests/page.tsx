"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { academicService, AcademicRequest } from '@/services/academicService';
import DataTable, { Column } from '@/components/admin/DataTable';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, Filter, Search, X, AlertTriangle } from 'lucide-react';
import styles from './requests.module.css';

export default function AcademicRequestsPage() {
    const [requests, setRequests] = useState<AcademicRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Rejection Modal State
    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; requestId: string | null }>({
        isOpen: false,
        requestId: null
    });
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        loadRequests();
    }, [filter]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const statusParams = filter === 'ALL' ? undefined : filter;
            const data = await academicService.getRequests(statusParams);
            setRequests(data);
        } catch (err: any) {
            toast.error('Failed to load academic requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            setProcessingId(id);
            await academicService.resolveRequest(id, 'APPROVED');
            toast.success('Request approved successfully');
            await loadRequests();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to approve request');
        } finally {
            setProcessingId(null);
        }
    };

    const openRejectModal = (id: string) => {
        setRejectModal({ isOpen: true, requestId: id });
        setRejectionReason('');
    };

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectModal.requestId || !rejectionReason) return;

        try {
            setProcessingId(rejectModal.requestId);
            await academicService.resolveRequest(rejectModal.requestId, 'REJECTED', rejectionReason);
            toast.success('Request rejected successfully');
            setRejectModal({ isOpen: false, requestId: null });
            await loadRequests();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reject request');
        } finally {
            setProcessingId(null);
        }
    };

    const columns: Column<AcademicRequest>[] = [
        {
            key: 'teacher',
            header: 'Teacher',
            width: '25%',
            render: (row) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{row.teacher.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{row.teacher.email}</div>
                </div>
            )
        },
        {
            key: 'type',
            header: 'Type',
            width: '15%',
            render: (row) => (
                <span className={`${styles.badge} ${styles[row.type.toLowerCase()]}`}>
                    {row.type}
                </span>
            )
        },
        {
            key: 'name',
            header: 'Requested Name',
            width: '25%',
            render: (row) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{row.name}</div>
                    {row.description && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{row.description}</div>
                    )}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            width: '15%',
            render: (row) => (
                <span className={`${styles.status} ${styles[row.status.toLowerCase()]}`}>
                    {row.status}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '20%',
            render: (row) => (
                <div className={styles.actions}>
                    {row.status === 'PENDING' && (
                        <>
                            <LoadingButton
                                onClick={() => handleApprove(row.id)}
                                className={styles.approveBtn}
                                title="Approve"
                                isLoading={processingId === row.id}
                                loadingText=""
                                size="sm"
                            >
                                <CheckCircle size={18} />
                                <span>Approve</span>
                            </LoadingButton>
                            <button
                                onClick={() => openRejectModal(row.id)}
                                className={styles.rejectBtn}
                                title="Reject"
                                disabled={processingId === row.id}
                            >
                                <XCircle size={18} />
                                <span>Reject</span>
                            </button>
                        </>
                    )}
                    {row.status !== 'PENDING' && row.reason && (
                        <div className={styles.reason} title={row.reason}>
                            Note: {row.reason.substring(0, 20)}...
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <div className={styles.iconWrapper}>
                            <Clock size={28} />
                        </div>
                        <div>
                            <h1 className={styles.title}>Academic Requests</h1>
                            <p className={styles.subtitle}>Review teacher suggestions for new categories and subjects</p>
                        </div>
                    </div>
                </div>

                <div className={styles.filterSection}>
                    <div className={styles.filters}>
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
                        <button
                            className={`${styles.filterBtn} ${filter === 'ALL' ? styles.active : ''}`}
                            onClick={() => setFilter('ALL')}
                        >
                            All
                        </button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={requests}
                    loading={loading}
                    emptyMessage="No academic requests found."
                    pageSize={10}
                />

                {/* Rejection Reason Modal */}
                {rejectModal.isOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <div className={styles.dangerIconWrapper}>
                                    <AlertTriangle size={20} />
                                </div>
                                <h2>Reject Request</h2>
                                <button onClick={() => setRejectModal({ isOpen: false, requestId: null })} className={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleReject}>
                                <div className={styles.modalContent}>
                                    <p>Please provide a reason for rejecting this request. This will be visible to the teacher.</p>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Reason for rejection..."
                                        required
                                        className={styles.rejectTextarea}
                                        rows={4}
                                        autoFocus
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setRejectModal({ isOpen: false, requestId: null })}
                                    >
                                        Cancel
                                    </button>
                                    <LoadingButton
                                        type="submit"
                                        variant="danger"
                                        isLoading={processingId === rejectModal.requestId}
                                        loadingText="Rejecting..."
                                    >
                                        Reject Request
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
