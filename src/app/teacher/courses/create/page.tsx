"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { academicService } from '@/services/academicService';
import { courseService } from '@/services/courseService';
import { uploadService } from '@/services/uploadService';
import { Category, Subject, Course } from '@/types';
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Video,
    FileText,
    CheckCircle,
    Upload,
    Loader2,
    BookOpen,
    Info,
    Layout
} from 'lucide-react';
import styles from './create.module.css';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import { motion, AnimatePresence } from 'framer-motion';

function CourseCreateWizard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('id');
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // Course state
    const [courseBasicInfo, setCourseBasicInfo] = useState({
        title: '',
        description: '',
        categoryId: '',
        subjectId: '',
        price: 0,
        thumbnail: ''
    });

    const [createdCourse, setCreatedCourse] = useState<Course | null>(null);
    const [units, setUnits] = useState<any[]>([]);

    // Modal states
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

    // New item form states
    const [newUnitTitle, setNewUnitTitle] = useState('');
    const [newLessonData, setNewLessonData] = useState({
        title: '',
        videoType: 'UPLOAD' as 'UPLOAD' | 'URL',
        videoUrl: '',
        videoFile: null as File | null,
        resourceFiles: [] as File[]
    });

    useEffect(() => {
        loadCategories();
        if (courseId) {
            loadExistingCourse(courseId);
        }
    }, [courseId]);

    const loadExistingCourse = async (id: string) => {
        try {
            setLoading(true);
            const course = await courseService.getCourse(id);
            setCreatedCourse(course);
            setCourseBasicInfo({
                title: course.title,
                description: course.description,
                categoryId: course.categoryId,
                subjectId: course.subjectId,
                price: course.price,
                thumbnail: course.thumbnail || ''
            });

            // Load curriculum if it exists
            // Since the API returns full course structure with units/lessons 
            // per the spec for GET /courses/:id
            if ((course as any).units) {
                setUnits((course as any).units);
            }
        } catch (error) {
            toast.error('Failed to load course draft');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseBasicInfo.categoryId) {
            loadSubjects(courseBasicInfo.categoryId);
        }
    }, [courseBasicInfo.categoryId]);

    const loadCategories = async () => {
        try {
            const data = await academicService.getCategories();
            setCategories(data || []);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const loadSubjects = async (catId: string) => {
        try {
            const data = await academicService.getSubjects(undefined, catId);
            setSubjects(data || []);
        } catch (error) {
            toast.error('Failed to load subjects');
        }
    };

    const handleCreateDraft = async () => {
        if (!courseBasicInfo.title || !courseBasicInfo.categoryId || !courseBasicInfo.subjectId) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            let course;
            if (createdCourse?.id) {
                // Update existing draft
                course = await courseService.updateCourse(createdCourse.id, courseBasicInfo);
                toast.success('Course draft updated!');
            } else {
                // Create new draft
                course = await courseService.createCourse(courseBasicInfo);
                toast.success('Course draft created! Now add your content.');
            }

            setCreatedCourse(course);
            setStep(1);
        } catch (error) {
            toast.error('Failed to save course draft');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUnit = async (title: string) => {
        if (!createdCourse) return;
        try {
            const unit = await courseService.addUnit(createdCourse.id, title, units.length + 1);
            setUnits([...units, { ...unit, lessons: [] }]);
            toast.success('Unit added');
        } catch (error) {
            toast.error('Failed to add unit');
        }
    };

    const handleSubmitCourse = async () => {
        if (!createdCourse) return;
        try {
            setLoading(true);
            await courseService.submitForReview(createdCourse.id);
            setStep(2);
            toast.success('Course submitted for review! 🚀');
        } catch (error) {
            toast.error('Failed to submit course');
        } finally {
            setLoading(false);
        }
    };

    const submitUnitModal = async () => {
        if (!newUnitTitle) return;
        setLoading(true);
        await handleAddUnit(newUnitTitle);
        setNewUnitTitle('');
        setIsUnitModalOpen(false);
        setLoading(false);
    };

    const submitLessonModal = async () => {
        if (!newLessonData.title || !activeUnitId) return;
        setLoading(true);

        try {
            let finalVideoUrl = newLessonData.videoUrl;
            // Upload Video if selected
            if (newLessonData.videoType === 'UPLOAD' && newLessonData.videoFile) {
                toast.loading('Uploading video...', { id: 'upload-video' });
                const vidRes = await uploadService.uploadVideo(newLessonData.videoFile);
                finalVideoUrl = vidRes.url;
                toast.dismiss('upload-video');
                toast.success('Video uploaded!');
            }

            // Upload Resources
            const resourceUrls: string[] = [];
            if (newLessonData.resourceFiles.length > 0) {
                toast.loading(`Uploading ${newLessonData.resourceFiles.length} resources...`, { id: 'upload-res' });
                // Parallel uploads
                const uploadPromises = newLessonData.resourceFiles.map(file => uploadService.uploadPDF(file));
                const results = await Promise.all(uploadPromises);
                results.forEach(res => resourceUrls.push(res.url));
                toast.dismiss('upload-res');
                toast.success('Resources uploaded!');
            }

            // Determine Lesson Type
            let lessonType = 'VIDEO';
            if (resourceUrls.length > 0 && !finalVideoUrl) {
                lessonType = 'DOCUMENT';
            }

            await courseService.addLesson(activeUnitId, {
                title: newLessonData.title,
                type: lessonType,
                videoUrl: finalVideoUrl,
                resources: resourceUrls,
                order: 1 // Backend handles ordering usually, or calculate based on prev lessons
            });

            // Update local state (Optimistic or fetch fresh - here using simple append for responsive UI)
            // Ideally we'd re-fetch the course/units, but for now we append.
            // Note: The object structure here should match what your UI expects to render
            const newLesson = {
                id: Date.now().toString(), // Temp ID until refresh
                title: newLessonData.title,
                type: 'VIDEO', // Defaulting for UI rendering
                videoUrl: finalVideoUrl,
                resources: resourceUrls
            };

            setUnits(prev => prev.map(u => u.id === activeUnitId ? { ...u, lessons: [...(u.lessons || []), newLesson] } : u));
            toast.success('Lesson added successfully');

            // Reset Form
            setNewLessonData({
                title: '',
                videoType: 'UPLOAD',
                videoUrl: '',
                videoFile: null,
                resourceFiles: []
            });
            setIsLessonModalOpen(false);
            setActiveUnitId(null);

        } catch (error) {
            console.error(error);
            toast.error('Failed to add lesson. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.stepper}>
                {[0, 1, 2].map((i) => (
                    <div key={i} className={`${styles.step} ${step >= i ? styles.active : ''}`}>
                        <div className={styles.stepCircle}>
                            {step > i ? <CheckCircle size={20} /> : i + 1}
                        </div>
                        <span className={styles.stepLabel}>
                            {i === 0 ? 'Basic Info' : i === 1 ? 'Curriculum' : 'Finish'}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.card}>
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className={styles.cardTitle}><Info size={24} /> Basic Information</h2>
                            <p className={styles.cardSubtitle}>Set the foundation for your course.</p>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Course Title</label>
                                    <input
                                        type="text"
                                        value={courseBasicInfo.title}
                                        onChange={(e) => setCourseBasicInfo({ ...courseBasicInfo, title: e.target.value })}
                                        placeholder="e.g. Master React in 30 Days"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    <select
                                        value={courseBasicInfo.categoryId}
                                        onChange={(e) => setCourseBasicInfo({ ...courseBasicInfo, categoryId: e.target.value, subjectId: '' })}
                                        className={styles.select}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject</label>
                                    <select
                                        value={courseBasicInfo.subjectId}
                                        onChange={(e) => setCourseBasicInfo({ ...courseBasicInfo, subjectId: e.target.value })}
                                        className={styles.select}
                                        disabled={!courseBasicInfo.categoryId}
                                    >
                                        <option value="">Select a subject</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        value={courseBasicInfo.price}
                                        onChange={(e) => setCourseBasicInfo({ ...courseBasicInfo, price: parseFloat(e.target.value) })}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                    <label>Short Description</label>
                                    <textarea
                                        value={courseBasicInfo.description}
                                        onChange={(e) => setCourseBasicInfo({ ...courseBasicInfo, description: e.target.value })}
                                        placeholder="Summarize what your students will achieve..."
                                        className={styles.textarea}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button disabled className={styles.ghostBtn}>Cancel</button>
                                <LoadingButton
                                    onClick={handleCreateDraft}
                                    className={styles.primaryBtn}
                                    isLoading={loading}
                                >
                                    {createdCourse ? 'Update & Continue' : 'Save & Continue'} <ChevronRight size={18} />
                                </LoadingButton>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className={styles.cardTitle}><Layout size={24} /> Curriculum Builder</h2>
                            <p className={styles.cardSubtitle}>Organize your content into sections and lessons.</p>

                            <div className={styles.curriculumArea}>
                                {units.map((unit, uIndex) => (
                                    <div key={unit.id} className={styles.unitBox}>
                                        <div className={styles.unitHeader}>
                                            <h3>Unit {uIndex + 1}: {unit.title}</h3>
                                            <button className={styles.deleteBtn}><Trash2 size={16} /></button>
                                        </div>

                                        <div className={styles.lessonList}>
                                            {unit.lessons.map((lesson: any, lIndex: number) => (
                                                <div key={lesson.id} className={styles.lessonItem}>
                                                    {lesson.type === 'VIDEO' ? <Video size={16} /> : <FileText size={16} />}
                                                    <span>{lesson.title}</span>
                                                </div>
                                            ))}
                                            <button
                                                className={styles.addLessonBtn}
                                                onClick={() => {
                                                    setActiveUnitId(unit.id);
                                                    setIsLessonModalOpen(true);
                                                }}
                                            >
                                                <Plus size={16} /> Add Lesson
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    className={styles.addUnitBtn}
                                    onClick={() => setIsUnitModalOpen(true)}
                                >
                                    <Plus size={18} /> Add New Unit
                                </button>
                            </div>

                            <div className={styles.actions}>
                                <button onClick={() => setStep(0)} className={styles.secondaryBtn}>
                                    <ChevronLeft size={18} /> Back
                                </button>
                                <LoadingButton
                                    onClick={handleSubmitCourse}
                                    className={styles.primaryBtn}
                                    isLoading={loading}
                                >
                                    Submit for Review <CheckCircle size={18} />
                                </LoadingButton>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            className={styles.successView}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className={styles.successIcon}>🚀</div>
                            <h2>Course Submitted!</h2>
                            <p>Great job! Your course is now in the review queue. We'll notify you once an administrator has audited your content.</p>
                            <Link href="/teacher/dashboard" className={styles.primaryBtn} style={{ marginTop: '2rem' }}>
                                Return to Dashboard
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isUnitModalOpen && (
                    <div className={styles.modalOverlay}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={styles.modal}
                        >
                            <div className={styles.modalHeader}>
                                <h2>Add New Unit</h2>
                                <button onClick={() => setIsUnitModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Unit Title</label>
                                    <input
                                        type="text"
                                        value={newUnitTitle}
                                        onChange={(e) => setNewUnitTitle(e.target.value)}
                                        placeholder="e.g. Introduction to React Hooks"
                                        className={styles.input}
                                        autoFocus
                                    />
                                </div>
                                <div className={styles.modalActions}>
                                    <button onClick={() => setIsUnitModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
                                    <LoadingButton
                                        onClick={submitUnitModal}
                                        className={styles.primaryBtn}
                                        isLoading={loading}
                                    >
                                        Create Unit
                                    </LoadingButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isLessonModalOpen && (
                    <div className={styles.modalOverlay}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={styles.modal}
                        >
                            <div className={styles.modalHeader}>
                                <h2>Add New Lesson</h2>
                                <button onClick={() => setIsLessonModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Lesson Title</label>
                                    <input
                                        type="text"
                                        value={newLessonData.title}
                                        onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                                        placeholder="e.g. Setting up your workspace"
                                        className={styles.input}
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Video Content</label>
                                    <div className={styles.tabs}>
                                        <button
                                            className={`${styles.tabBtn} ${newLessonData.videoType === 'UPLOAD' ? styles.activeTab : ''}`}
                                            onClick={() => setNewLessonData({ ...newLessonData, videoType: 'UPLOAD' })}
                                        >
                                            Upload Video
                                        </button>
                                        <button
                                            className={`${styles.tabBtn} ${newLessonData.videoType === 'URL' ? styles.activeTab : ''}`}
                                            onClick={() => setNewLessonData({ ...newLessonData, videoType: 'URL' })}
                                        >
                                            External URL
                                        </button>
                                    </div>

                                    {newLessonData.videoType === 'UPLOAD' ? (
                                        <div className={styles.fileUpload}>
                                            <input
                                                type="file"
                                                id="lesson-video"
                                                accept="video/*"
                                                onChange={(e) => setNewLessonData({ ...newLessonData, videoFile: e.target.files?.[0] || null })}
                                                className={styles.fileInput}
                                            />
                                            <label htmlFor="lesson-video" className={styles.fileLabel}>
                                                <Upload size={20} />
                                                <span>{newLessonData.videoFile ? newLessonData.videoFile.name : 'Choose Video File'}</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={newLessonData.videoUrl}
                                            onChange={(e) => setNewLessonData({ ...newLessonData, videoUrl: e.target.value })}
                                            placeholder="https://youtube.com/..."
                                            className={styles.input}
                                        />
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Resources (PDFs)</label>
                                    <div className={styles.fileUpload}>
                                        <input
                                            type="file"
                                            id="lesson-resources"
                                            accept="application/pdf"
                                            multiple
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setNewLessonData({
                                                        ...newLessonData,
                                                        resourceFiles: [...newLessonData.resourceFiles, ...Array.from(e.target.files)]
                                                    });
                                                }
                                            }}
                                            className={styles.fileInput}
                                        />
                                        <label htmlFor="lesson-resources" className={styles.fileLabel}>
                                            <FileText size={20} />
                                            <span>Add PDF Resources</span>
                                        </label>
                                    </div>
                                    {newLessonData.resourceFiles.length > 0 && (
                                        <div className={styles.resourceList}>
                                            {newLessonData.resourceFiles.map((file, idx) => (
                                                <div key={idx} className={styles.resourceItem}>
                                                    <FileText size={14} />
                                                    <span className={styles.resourceName}>{file.name}</span>
                                                    <button
                                                        onClick={() => setNewLessonData({
                                                            ...newLessonData,
                                                            resourceFiles: newLessonData.resourceFiles.filter((_, i) => i !== idx)
                                                        })}
                                                        className={styles.removeResource}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.modalActions}>
                                    <button onClick={() => setIsLessonModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
                                    <LoadingButton
                                        onClick={submitLessonModal}
                                        className={styles.primaryBtn}
                                        isLoading={loading}
                                    >
                                        Add Lesson
                                    </LoadingButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function CourseCreatePage() {
    return (
        <ProtectedRoute requiredRole="TEACHER">
            <CourseCreateWizard />
        </ProtectedRoute>
    );
}
import { X } from 'lucide-react';
import Link from 'next/link';
