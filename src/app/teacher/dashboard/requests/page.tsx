"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { academicService, AcademicRequest } from '@/services/academicService';
import { Category } from '@/types';
import { Plus, Clock, CheckCircle, XCircle, MessageSquarePlus, X, Rocket, Info, ChevronRight } from 'lucide-react';
import styles from './requests.module.css';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import { motion, AnimatePresence } from 'framer-motion';

function TopicRequestsPageContent() {
    const [requests, setRequests] = useState<AcademicRequest[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [requestType, setRequestType] = useState<'CATEGORY' | 'SUBJECT'>('CATEGORY');
    const [requestName, setRequestName] = useState('');
    const [requestDescription, setRequestDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        loadRequests();
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await academicService.getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await academicService.getRequests();
            setRequests(data || []);
        } catch (error) {
            console.error('Error loading requests:', error);
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
                description: requestDescription,
                categoryId: requestType === 'SUBJECT' ? categoryId : undefined
            });
            toast.success('Request submitted for approval! 🚀');
            setIsModalOpen(false);
            setRequestName('');
            setRequestDescription('');
            setCategoryId('');
            loadRequests();
        } catch (error) {
            toast.error('Failed to submit request.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className={`${styles.status} ${styles.approved}`}><CheckCircle size={12} /> Approved</span>;
            case 'PENDING': return <span className={`${styles.status} ${styles.pending}`}><Clock size={12} /> Pending</span>;
            case 'REJECTED': return <span className={`${styles.status} ${styles.rejected}`}><XCircle size={12} /> Rejected</span>;
            default: return <span className={styles.status}>{status}</span>;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Topic Requests</h1>
                    <p className={styles.subtitle}>Collaborate on the platform's academic curriculum.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.primaryBtn}
                >
                    <Plus size={18} />
                    <span>Submit New Request</span>
                </button>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.infoIcon}><Rocket size={24} /></div>
                <div className={styles.infoContent}>
                    <h3>Help us grow the curriculum</h3>
                    <p>Can't find a subject you want to teach? Request a new category or subject here. Our administrators will review and add it to the platform within 24 hours.</p>
                </div>
            </div>

            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>My Submissions</h2>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading requests...</div>
            ) : requests.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📬</div>
                    <h3>No requests yet</h3>
                    <p>When you request new topics, they will appear here along with their status.</p>
                </div>
            ) : (
                <div className={styles.requestGrid}>
                    {requests.map((request) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.requestCard}
                        >
                            <div className={styles.requestHeader}>
                                <div className={styles.typeBadge}>{request.type}</div>
                                {getStatusBadge(request.status)}
                            </div>
                            <h3 className={styles.requestName}>{request.name}</h3>
                            {request.description && (
                                <p className={styles.requestDesc}>{request.description}</p>
                            )}
                            <div className={styles.requestFooter}>
                                <span className={styles.date}>{new Date(request.createdAt).toLocaleDateString()}</span>
                                {request.status === 'REJECTED' && request.reason && (
                                    <div className={styles.reasonTooltip}>
                                        <Info size={14} /> View Reason
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.modal}
                    >
                        <div className={styles.modalHeader}>
                            <h2>New Topic Request</h2>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                        </div>
                        <form className={styles.form} onSubmit={handleRequestSubmit}>
                            <div className={styles.formGroup}>
                                <label>What are you requesting?</label>
                                <select
                                    value={requestType}
                                    onChange={(e) => setRequestType(e.target.value as any)}
                                    className={styles.select}
                                >
                                    <option value="CATEGORY">New Category (e.g. Artificial Intelligence)</option>
                                    <option value="SUBJECT">New Subject (within existing category)</option>
                                </select>
                            </div>

                            {requestType === 'SUBJECT' && (
                                <div className={styles.formGroup}>
                                    <label>Select Category</label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className={styles.select}
                                        required
                                    >
                                        <option value="">Select a category...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label>Topic Name</label>
                                <input
                                    type="text"
                                    value={requestName}
                                    onChange={(e) => setRequestName(e.target.value)}
                                    placeholder="e.g. Prompt Engineering"
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Why should we add this? (Brief Rationale)</label>
                                <textarea
                                    value={requestDescription}
                                    onChange={(e) => setRequestDescription(e.target.value)}
                                    placeholder="Explain the student demand or unique value..."
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <LoadingButton
                                    type="submit"
                                    className={styles.primaryBtn}
                                    isLoading={submitting}
                                    loadingText="Submitting..."
                                >
                                    Send Request
                                </LoadingButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default function TopicRequestsPage() {
    return (
        <ProtectedRoute requiredRole="TEACHER">
            <TopicRequestsPageContent />
        </ProtectedRoute>
    );
}
