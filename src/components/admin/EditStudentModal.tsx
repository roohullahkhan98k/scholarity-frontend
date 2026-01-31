import { Student } from '@/services/studentService';
import { X } from 'lucide-react';
import { useState } from 'react';
import styles from './EditStudentModal.module.css';

interface EditStudentModalProps {
    student: Student;
    onClose: () => void;
    onSave: (id: string, data: any) => void;
    loading?: boolean;
}

export default function EditStudentModal({
    student,
    onClose,
    onSave,
    loading
}: EditStudentModalProps) {
    const [formData, setFormData] = useState({
        bio: student.bio || '',
        interests: student.interests || '',
        enrolledCourses: student.enrolledCourses || 0,
        completedCourses: student.completedCourses || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(student.id, formData);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Edit Student</h2>
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
                        <label className={styles.label}>Interests</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={formData.interests}
                            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                            placeholder="JavaScript, React, Node.js"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Enrolled Courses</label>
                            <input
                                type="number"
                                min="0"
                                className={styles.input}
                                value={formData.enrolledCourses}
                                onChange={(e) => setFormData({ ...formData, enrolledCourses: parseInt(e.target.value) })}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Completed Courses</label>
                            <input
                                type="number"
                                min="0"
                                className={styles.input}
                                value={formData.completedCourses}
                                onChange={(e) => setFormData({ ...formData, completedCourses: parseInt(e.target.value) })}
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
