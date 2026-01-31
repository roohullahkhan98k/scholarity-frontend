import { InstructorApplication } from '@/services/instructorService';
import { X, Mail, User, Briefcase, Award, Calendar } from 'lucide-react';
import styles from './ApplicationModal.module.css';

interface ApplicationModalProps {
    application: InstructorApplication;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    loading?: boolean;
}

export default function ApplicationModal({
    application,
    onClose,
    onApprove,
    onReject,
    loading
}: ApplicationModalProps) {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Application Details</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <User size={18} />
                            <h3>Personal Information</h3>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Name</span>
                                <span className={styles.value}>{application.user.name}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Email</span>
                                <span className={styles.value}>{application.user.email}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Applied Date</span>
                                <span className={styles.value}>
                                    {new Date(application.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Status</span>
                                <span className={`${styles.badge} ${styles[application.status.toLowerCase()]}`}>
                                    {application.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Briefcase size={18} />
                            <h3>Professional Background</h3>
                        </div>
                        <div className={styles.textContent}>
                            <div className={styles.field}>
                                <span className={styles.fieldLabel}>Bio</span>
                                <p className={styles.fieldText}>{application.bio}</p>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.fieldLabel}>Expertise</span>
                                <p className={styles.fieldText}>{application.expertise}</p>
                            </div>
                            <div className={styles.field}>
                                <span className={styles.fieldLabel}>Experience</span>
                                <p className={styles.fieldText}>{application.experience}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {application.status === 'PENDING' && (
                    <div className={styles.footer}>
                        <button
                            className={styles.rejectBtn}
                            onClick={() => onReject(application.id)}
                            disabled={loading}
                        >
                            Reject Application
                        </button>
                        <button
                            className={styles.approveBtn}
                            onClick={() => onApprove(application.id)}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Approve Application'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
