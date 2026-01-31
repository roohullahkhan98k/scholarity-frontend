import { Teacher } from '@/services/teacherService';
import { X } from 'lucide-react';
import { useState } from 'react';
import styles from './EditTeacherModal.module.css';

interface EditTeacherModalProps {
    teacher: Teacher;
    onClose: () => void;
    onSave: (id: string, data: any) => void;
    loading?: boolean;
}

export default function EditTeacherModal({
    teacher,
    onClose,
    onSave,
    loading
}: EditTeacherModalProps) {
    const [formData, setFormData] = useState({
        bio: teacher.bio || '',
        expertise: teacher.expertise || '',
        experience: teacher.experience || '',
        rating: teacher.rating || 0,
        totalStudents: teacher.totalStudents || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(teacher.id, formData);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Edit Teacher</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Bio</label>
                        <textarea
                            className={styles.textarea}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Expertise</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.expertise}
                            onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Experience</label>
                        <textarea
                            className={styles.textarea}
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                className={styles.input}
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Total Students</label>
                            <input
                                type="number"
                                min="0"
                                className={styles.input}
                                value={formData.totalStudents}
                                onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
