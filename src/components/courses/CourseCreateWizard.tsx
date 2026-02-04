"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { academicService } from '@/services/academicService';
import { courseService } from '@/services/courseService';
import { teacherService, Teacher } from '@/services/teacherService';
import { uploadService } from '@/services/uploadService';
import { Category, Subject, Course } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import PremiumSelect from '@/components/PremiumSelect/PremiumSelect';
import { getFileUrl } from '@/lib/utils';
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Video,
    FileText,
    CheckCircle,
    Upload,
    Info,
    Layout,
    X,
    Link as LinkIcon
} from 'lucide-react';
import styles from './CourseCreateWizard.module.css';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import { motion, AnimatePresence } from 'framer-motion';
import AdminAddUnitModal from '@/components/admin/AdminAddUnitModal';
import AdminAddLessonModal from '@/components/admin/AdminAddLessonModal';

export default function CourseCreateWizard({ returnPath = '/teacher/dashboard' }: { returnPath?: string }) {
    const { user, hasRole } = useAuth();
    const isAdmin = hasRole('SUPER_ADMIN');
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('id');
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loadingStates, setLoadingStates] = useState({
        categories: false,
        subjects: false,
        teachers: false
    });

    // Course state
    const [courseBasicInfo, setCourseBasicInfo] = useState({
        title: '',
        description: '',
        categoryId: '',
        subjectId: '',
        price: 0,
        thumbnail: '',
        teacherId: ''
    });

    const [createdCourse, setCreatedCourse] = useState<Course | null>(null);
    const [units, setUnits] = useState<any[]>([]);
    const [thumbnailLoading, setThumbnailLoading] = useState(false);

    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
        if (isAdmin) {
            loadTeachers();
        }
        if (courseId) {
            loadExistingCourse(courseId);
        }
    }, [courseId, isAdmin]);

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
                thumbnail: course.thumbnail || '',
                teacherId: course.teacherId || ''
            });

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
            setLoadingStates(prev => ({ ...prev, categories: true }));
            const data = await academicService.getCategories();
            setCategories(data || []);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoadingStates(prev => ({ ...prev, categories: false }));
        }
    };

    const loadSubjects = async (catId: string) => {
        try {
            setLoadingStates(prev => ({ ...prev, subjects: true }));
            const data = await academicService.getSubjects(undefined, catId);
            setSubjects(data || []);
        } catch (error) {
            toast.error('Failed to load subjects');
        } finally {
            setLoadingStates(prev => ({ ...prev, subjects: false }));
        }
    };

    const loadTeachers = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, teachers: true }));
            const data = await teacherService.getTeachers();
            setTeachers(data || []);
        } catch (error) {
            toast.error('Failed to load teachers list');
        } finally {
            setLoadingStates(prev => ({ ...prev, teachers: false }));
        }
    };

    const handleCreateDraft = async () => {
        if (!courseBasicInfo.title || !courseBasicInfo.categoryId || !courseBasicInfo.subjectId || !courseBasicInfo.thumbnail) {
            toast.error('Please fill in all required fields including the thumbnail');
            return;
        }

        if (isAdmin && !courseBasicInfo.teacherId) {
            toast.error('Please assign a teacher to this course');
            return;
        }

        try {
            setLoading(true);
            let course;
            if (createdCourse?.id) {
                course = await courseService.updateCourse(createdCourse.id, courseBasicInfo);
                toast.success('Course draft updated!');
            } else {
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

    const handleAddUnit = () => {
        if (!createdCourse) return;
        setIsUnitModalOpen(true);
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
                                    <PremiumSelect
                                        label="Category"
                                        options={categories}
                                        value={courseBasicInfo.categoryId}
                                        onChange={(val) => setCourseBasicInfo({ ...courseBasicInfo, categoryId: val, subjectId: '' })}
                                        placeholder="Select a category"
                                        loading={loadingStates.categories}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <PremiumSelect
                                        label="Subject"
                                        options={subjects}
                                        value={courseBasicInfo.subjectId}
                                        onChange={(val) => setCourseBasicInfo({ ...courseBasicInfo, subjectId: val })}
                                        placeholder="Select a subject"
                                        disabled={!courseBasicInfo.categoryId}
                                        loading={loadingStates.subjects}
                                    />
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
                                {isAdmin && (
                                    <div className={styles.formGroup}>
                                        <PremiumSelect
                                            label="Assign Teacher"
                                            options={teachers.map(t => ({ id: t.id, name: t.name, description: t.expertise }))}
                                            value={courseBasicInfo.teacherId}
                                            onChange={(val) => setCourseBasicInfo({ ...courseBasicInfo, teacherId: val })}
                                            placeholder="Search & select teacher"
                                            loading={loadingStates.teachers}
                                            searchable={true}
                                        />
                                    </div>
                                )}
                                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                    <label>Course Thumbnail <span style={{ color: '#ef4444' }}>*</span></label>
                                    <div
                                        className={styles.thumbnailUpload}
                                        onClick={() => document.getElementById('thumbnail-input')?.click()}
                                    >
                                        <input
                                            type="file"
                                            id="thumbnail-input"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    try {
                                                        setThumbnailLoading(true);
                                                        const res = await uploadService.uploadImage(file);
                                                        setCourseBasicInfo(prev => ({ ...prev, thumbnail: res.url }));
                                                        toast.success('Thumbnail uploaded!');
                                                    } catch (err) {
                                                        toast.error('Failed to upload thumbnail');
                                                    } finally {
                                                        setThumbnailLoading(false);
                                                    }
                                                }
                                            }}
                                        />
                                        {thumbnailLoading ? (
                                            <div className={styles.uploadingOverlay}>
                                                <div className={styles.spinner}></div>
                                                <span>Uploading Thumbnail...</span>
                                            </div>
                                        ) : courseBasicInfo.thumbnail ? (
                                            <div className={styles.thumbnailPreview}>
                                                <img
                                                    src={getFileUrl(courseBasicInfo.thumbnail)}
                                                    alt="Thumbnail"
                                                    className={styles.previewImg}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.removeThumbnail}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCourseBasicInfo(prev => ({ ...prev, thumbnail: '' }));
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <Upload size={32} />
                                                <span>Click to upload course thumbnail</span>
                                                <p className={styles.uploadHint}>Recomended ratio 16:9 (e.g. 1280x720px)</p>
                                            </div>
                                        )}
                                    </div>
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
                                <button className={styles.ghostBtn} onClick={() => router.back()}>Cancel</button>
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
                                            {unit.lessons.map((lesson: any) => (
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
                            <Link href={returnPath} className={styles.primaryBtn} style={{ marginTop: '2rem', display: 'inline-flex' }}>
                                Return to Dashboard
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isUnitModalOpen && createdCourse && (
                    <AdminAddUnitModal
                        courseId={createdCourse.id}
                        nextOrder={units.length + 1}
                        onClose={() => setIsUnitModalOpen(false)}
                        onSuccess={() => loadExistingCourse(createdCourse.id)}
                    />
                )}

                {isLessonModalOpen && activeUnitId && createdCourse && (
                    <AdminAddLessonModal
                        unitId={activeUnitId}
                        nextOrder={(units.find(u => u.id === activeUnitId)?.lessons?.length || 0) + 1}
                        onClose={() => {
                            setIsLessonModalOpen(false);
                            setActiveUnitId(null);
                        }}
                        onSuccess={() => loadExistingCourse(createdCourse.id)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
