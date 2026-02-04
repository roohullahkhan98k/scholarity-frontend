import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, Video, FileText, Link as LinkIcon, BookOpen, Layers, Upload } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { uploadService } from '@/services/uploadService';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import ResourceItem from '@/components/courses/ResourceItem';
import styles from './AdminAddLessonModal.module.css';
import { getFileUrl } from '@/lib/utils';

interface AdminAddLessonModalProps {
    unitId: string;
    onClose: () => void;
    onSuccess: () => void;
    nextOrder: number;
}

type ResourceType = 'VIDEO' | 'NOTE' | 'LINK' | 'SYLLABUS';

interface Resource {
    title: string;
    url: string;
    type: ResourceType;
}

const AdminAddLessonModal: React.FC<AdminAddLessonModalProps> = ({ unitId, onClose, onSuccess, nextOrder }) => {
    const [title, setTitle] = useState('');
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [resUploadLoading, setResUploadLoading] = useState(false);

    // Temp inputs for new resource
    const [resTitle, setResTitle] = useState('');
    const [resUrl, setResUrl] = useState('');
    const [resType, setResType] = useState<ResourceType>('VIDEO');

    const addResource = () => {
        if (!resTitle.trim()) return toast.error('Resource Title is required');
        if (!resUrl.trim()) return toast.error('Resource URL/Path is required');

        setResources([...resources, { title: resTitle, url: resUrl, type: resType }]);
        setResTitle('');
        setResUrl('');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setResUploadLoading(true);
            let res;
            if (resType === 'VIDEO') {
                res = await uploadService.uploadVideo(file);
            } else {
                res = await uploadService.uploadPDF(file);
            }
            setResUrl(res.url);
            if (!resTitle) setResTitle(file.name.split('.')[0]);
            toast.success('File uploaded');
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setResUploadLoading(false);
        }
    };

    const removeResource = (index: number) => {
        setResources(resources.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return toast.error('Lesson Title is required');
        if (resources.length === 0) return toast.error('Please add at least one resource content');

        try {
            setLoading(true);
            const primaryType = resources.some(r => r.type === 'VIDEO') ? 'VIDEO' : 'DOCUMENT';

            await courseService.addLesson(unitId, {
                title,
                order: nextOrder,
                type: primaryType,
                resources: resources
            });

            toast.success('Lesson created successfully');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to add lesson');
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
                            <Layers size={20} />
                        </div>
                        <div className={styles.titleText}>
                            <h3>Add New Lesson</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <form onSubmit={handleSubmit}>

                        {/* Lesson Basics */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Lesson Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Part 1: Advanced Concepts"
                                className={styles.input}
                                autoFocus
                            />
                        </div>

                        {/* Resources Builder */}
                        <div className={styles.resourceSection}>
                            <div className={styles.sectionHeader}>
                                <h4 className={styles.sectionTitle}>
                                    <BookOpen size={16} />
                                    Lesson Resources
                                </h4>
                                <span className={styles.badge}>
                                    {resources.length}
                                </span>
                            </div>

                            {/* Resource Input Form */}
                            <div className={styles.resourceInputBox}>
                                <div className={styles.gridRow}>
                                    <input
                                        type="text"
                                        placeholder="Item Title (e.g. Tutorial PDF)"
                                        value={resTitle}
                                        onChange={(e) => setResTitle(e.target.value)}
                                        className={styles.input}
                                    />
                                    <select
                                        value={resType}
                                        onChange={(e) => setResType(e.target.value as ResourceType)}
                                        className={styles.select}
                                    >
                                        <option value="VIDEO">Video</option>
                                        <option value="NOTE">PDF / Note</option>
                                        <option value="LINK">Link</option>
                                        <option value="SYLLABUS">Syllabus</option>
                                    </select>
                                </div>
                                <div className={styles.flexRow}>
                                    {resType === 'LINK' ? (
                                        <input
                                            type="text"
                                            placeholder="URL (https://...)"
                                            value={resUrl}
                                            onChange={(e) => setResUrl(e.target.value)}
                                            className={styles.urlInput}
                                        />
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder={resType === 'VIDEO' ? "Video URL or Upload" : "Upload Document"}
                                                value={resUrl}
                                                onChange={(e) => setResUrl(e.target.value)}
                                                className={styles.urlInput}
                                            />
                                            <input
                                                type="file"
                                                id="resFileUpload"
                                                style={{ display: 'none' }}
                                                onChange={handleFileUpload}
                                                accept={resType === 'VIDEO' ? 'video/*' : '.pdf,.doc,.docx'}
                                            />
                                            <button
                                                type="button"
                                                disabled={resUploadLoading}
                                                onClick={() => document.getElementById('resFileUpload')?.click()}
                                                className={styles.addButton}
                                                style={{ background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                            >
                                                {resUploadLoading ? <div className="spinner-sm" /> : <Upload size={16} />}
                                                Upload
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={addResource}
                                        className={styles.addButton}
                                        disabled={!resTitle || !resUrl}
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            {/* Resource List Preview */}
                            <div className={styles.resourceList}>
                                {resources.map((res, idx) => (
                                    <ResourceItem
                                        key={idx}
                                        resource={res}
                                        compact={true}
                                        onDelete={() => removeResource(idx)}
                                    />
                                ))}
                                {resources.length === 0 && (
                                    <div className={styles.emptyState}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Add Content Above</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
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
                        onClick={handleSubmit}
                        className={styles.submitBtn}
                    >
                        Save Lesson
                    </LoadingButton>
                </div>
            </div>
        </div>
    );
};

export default AdminAddLessonModal;
