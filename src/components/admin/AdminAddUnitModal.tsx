import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Plus, FolderPlus } from 'lucide-react';
import { courseService } from '@/services/courseService';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import styles from './AdminAddUnitModal.module.css';

interface AdminAddUnitModalProps {
    courseId: string;
    onClose: () => void;
    onSuccess: () => void;
    nextOrder: number;
}

const AdminAddUnitModal: React.FC<AdminAddUnitModalProps> = ({ courseId, onClose, onSuccess, nextOrder }) => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return toast.error('Title is required');

        try {
            setLoading(true);
            await courseService.addUnit(courseId, title, nextOrder);
            toast.success('Unit added successfully');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to add unit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <div className={styles.iconWrapper}>
                            <FolderPlus size={20} />
                        </div>
                        <div className={styles.titleText}>
                            <h3>Add New Unit</h3>
                            <p className={styles.subText}>Unit {nextOrder}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Unit Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Chapter 1: Foundations"
                            className={styles.input}
                            autoFocus
                        />
                        <p className={styles.helpText}>
                            Create a container for your lessons. You can add lessons to this unit after creating it.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <LoadingButton
                            type="submit"
                            isLoading={loading}
                            className={styles.submitBtn}
                        >
                            <Plus size={18} /> Create Unit
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddUnitModal;
