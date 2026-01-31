import { InstructorApplication } from '@/services/instructorService';
import styles from './ApplicationCard.module.css';

interface ApplicationCardProps {
    application: InstructorApplication;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    loading?: boolean;
}

export default function ApplicationCard({
    application,
    onApprove,
    onReject,
    loading
}: ApplicationCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.name}>{application.user.name}</h3>
                    <p className={styles.email}>{application.user.email}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h4 className={styles.label}>Bio</h4>
                    <p className={styles.text}>{application.bio}</p>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.label}>Expertise</h4>
                    <p className={styles.text}>{application.expertise}</p>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.label}>Experience</h4>
                    <p className={styles.text}>{application.experience}</p>
                </div>

                <div className={styles.meta}>
                    <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {application.status === 'PENDING' && (
                <div className={styles.actions}>
                    <button
                        className={`btn btn-primary ${styles.approveBtn}`}
                        onClick={() => onApprove(application.id)}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                        className={`btn btn-outline ${styles.rejectBtn}`}
                        onClick={() => onReject(application.id)}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Reject'}
                    </button>
                </div>
            )}

            {application.status === 'REJECTED' && application.rejectionReason && (
                <div className={styles.rejection}>
                    <strong>Rejection Reason:</strong> {application.rejectionReason}
                </div>
            )}
        </div>
    );
}
