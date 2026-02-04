import React, { useState } from 'react';
import { Course, CreateCourseDto } from '@/types';
import { courseService } from '@/services/courseService';
import { uploadService } from '@/services/uploadService';
import toast from 'react-hot-toast';
import { X, Save, Upload } from 'lucide-react';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import { getFileUrl } from '@/lib/utils';

interface AdminEditCourseModalProps {
    course: Course;
    onClose: () => void;
    onSuccess: () => void;
}

const AdminEditCourseModal: React.FC<AdminEditCourseModalProps> = ({ course, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<Partial<CreateCourseDto>>({
        title: course.title,
        description: course.description,
        price: course.price,
        thumbnail: course.thumbnail || '',
    });
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await courseService.updateCourse(course.id, formData);
            toast.success('Course updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Course</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} color="#6b7280" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Course Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.95rem'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '0.95rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Price ($)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Course Thumbnail <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={{
                            border: '2px dashed #e5e7eb',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s',
                            backgroundColor: '#f8fafc'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                            onClick={() => document.getElementById('thumbnailInput')?.click()}
                        >
                            <input
                                id="thumbnailInput"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            setUploadLoading(true);
                                            const res = await uploadService.uploadImage(file);
                                            setFormData(prev => ({ ...prev, thumbnail: res.url }));
                                            toast.success('Thumbnail uploaded');
                                        } catch (err) {
                                            toast.error('Upload failed');
                                        } finally {
                                            setUploadLoading(false);
                                        }
                                    }
                                }}
                            />
                            {uploadLoading ? (
                                <div style={{ padding: '0.5rem' }}>
                                    <div className="spinner-sm" style={{ margin: '0 auto' }}></div>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Uploading...</p>
                                </div>
                            ) : formData.thumbnail ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={getFileUrl(formData.thumbnail)} alt="Preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData(prev => ({ ...prev, thumbnail: '' }));
                                            toast.success('Thumbnail removed');
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>Click to change image</div>
                                </div>
                            ) : (
                                <div style={{ color: '#64748b' }}>
                                    <Upload size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to upload image</div>
                                    <div style={{ fontSize: '0.75rem' }}>PNG, JPG, WebP up to 5MB</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                background: 'white',
                                border: '1px solid #d1d5db',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: 500
                            }}
                        >
                            Cancel
                        </button>
                        <LoadingButton
                            type="submit"
                            isLoading={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Changes
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditCourseModal;
