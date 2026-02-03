"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { courseService } from '@/services/courseService';
import { academicService } from '@/services/academicService';
import { Course, Unit, Lesson, Category, Subject } from '@/types';
import { uploadService } from '@/services/uploadService';
import {
    BookOpen,
    Layers,
    Video,
    CheckCircle,
    ChevronRight,
    Plus,
    Trash2,
    Save,
    Layout,
    FileText,
    DollarSign,
    Image as ImageIcon,
    Upload,
    Link as LinkIcon,
    File
} from 'lucide-react';
import styles from './create.module.css';

export default function CreateCoursePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // Step 1: Course Info
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        categoryId: '',
        subjectId: '',
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
    });

    const [createdCourse, setCreatedCourse] = useState<Course | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [currentUnitTitle, setCurrentUnitTitle] = useState('');

    useEffect(() => {
        loadAcademicData();
    }, []);

    const loadAcademicData = async () => {
        try {
            const data = await academicService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleCategoryChange = (catId: string) => {
        setCourseData({ ...courseData, categoryId: catId, subjectId: '' });
        const category = categories.find(c => c.id === catId);
        setSubjects(category?.subjects || []);
    };

    const handleInitializeCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const course = await courseService.createCourse(courseData);
            setCreatedCourse(course);
            setStep(2);
        } catch (error) {
            console.error('Failed to create course draft', error);
            alert('Failed to create course draft. Please check your information.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUnit = async () => {
        if (!createdCourse || !currentUnitTitle) return;
        try {
            setLoading(true);
            const unit = await courseService.addUnit(createdCourse.id, {
                title: currentUnitTitle,
                order: units.length + 1
            });
            setUnits([...units, unit]);
            setCurrentUnitTitle('');
        } catch (error) {
            console.error('Failed to add unit', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextToLessons = () => {
        if (units.length === 0) {
            alert('Please add at least one unit before proceeding.');
            return;
        }
        setStep(3);
    };

    const handleSubmitForReview = async () => {
        if (!createdCourse) return;
        try {
            setLoading(true);
            await courseService.submitForReview(createdCourse.id);
            router.push('/admin/dashboard'); // Or teacher dashboard depending on role
        } catch (error) {
            console.error('Failed to submit for review', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute requiredRole={['TEACHER', 'SUPER_ADMIN']}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create New Course</h1>
                    <div className={styles.stepper}>
                        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
                            <div className={styles.stepNum}>1</div>
                            <span>Course Info</span>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
                            <div className={styles.stepNum}>2</div>
                            <span>Structure</span>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
                            <div className={styles.stepNum}>3</div>
                            <span>Content</span>
                        </div>
                        <div className={styles.stepConnector} />
                        <div className={`${styles.step} ${step >= 4 ? styles.active : ''}`}>
                            <div className={styles.stepNum}>4</div>
                            <span>Publish</span>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    {step === 1 && (
                        <form onSubmit={handleInitializeCourse} className={styles.form}>
                            <div className={styles.formSection}>
                                <h3 className={styles.sectionTitle}><BookOpen size={20} /> Basic Information</h3>
                                <div className={styles.formGroup}>
                                    <label>Course Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Modern React Mastery"
                                        value={courseData.title}
                                        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        placeholder="What will students learn?"
                                        rows={4}
                                        value={courseData.description}
                                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    <select
                                        value={courseData.categoryId}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject</label>
                                    <select
                                        value={courseData.subjectId}
                                        onChange={(e) => setCourseData({ ...courseData, subjectId: e.target.value })}
                                        required
                                        disabled={!courseData.categoryId}
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Price ($)</label>
                                    <div className={styles.priceInput}>
                                        <DollarSign size={16} />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={courseData.price}
                                            onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Thumbnail URL</label>
                                    <div className={styles.priceInput}>
                                        <ImageIcon size={16} />
                                        <input
                                            type="text"
                                            value={courseData.thumbnail}
                                            onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Initializing...' : 'Next: Build Structure'}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <div className={styles.structureStep}>
                            <h3 className={styles.sectionTitle}><Layers size={20} /> Build Course Structure</h3>
                            <p className={styles.stepHint}>Organize your course into units/chapters.</p>

                            <div className={styles.unitList}>
                                {units.map((unit, index) => (
                                    <div key={unit.id} className={styles.unitItem}>
                                        <div className={styles.unitInfo}>
                                            <span className={styles.unitIndex}>Unit {index + 1}</span>
                                            <span className={styles.unitTitle}>{unit.title}</span>
                                        </div>
                                        <button className={styles.deleteBtn}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.addUnitForm}>
                                <input
                                    type="text"
                                    placeholder="e.g. Introduction to Hooks"
                                    value={currentUnitTitle}
                                    onChange={(e) => setCurrentUnitTitle(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline"
                                    onClick={handleAddUnit}
                                    disabled={loading || !currentUnitTitle}
                                >
                                    <Plus size={18} />
                                    Add Unit
                                </button>
                            </div>

                            <div className={styles.formActions}>
                                <button className="btn btn-primary" onClick={handleNextToLessons} disabled={units.length === 0}>
                                    Next: Add Lessons
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.lessonsStep}>
                            <h3 className={styles.sectionTitle}><Video size={20} /> Add Lessons</h3>
                            <p className={styles.stepHint}>Add video, documents, or quizzes to your units.</p>

                            {units.map((unit) => (
                                <UnitEditor key={unit.id} unit={unit} />
                            ))}

                            <div className={styles.formActions}>
                                <button className="btn btn-primary" onClick={() => setStep(4)}>
                                    Next: Review & Submit
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className={styles.publishStep}>
                            <div className={styles.successIcon}>
                                <CheckCircle size={64} color="#10b981" />
                            </div>
                            <h2 className={styles.publishTitle}>Ready to Publish?</h2>
                            <p className={styles.publishText}>
                                Once you submit, your course will be sent to the admin for review.
                                You won't be able to edit it until the review is complete.
                            </p>

                            <div className={styles.courseReview}>
                                <div className={styles.reviewItem}>
                                    <span className={styles.reviewLabel}>Title:</span>
                                    <span>{courseData.title}</span>
                                </div>
                                <div className={styles.reviewItem}>
                                    <span className={styles.reviewLabel}>Units:</span>
                                    <span>{units.length}</span>
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button className="btn btn-primary" onClick={handleSubmitForReview} disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit for Review'}
                                    <Save size={18} style={{ marginLeft: '0.5rem' }} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

function UnitEditor({ unit }: { unit: Unit }) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newLesson, setNewLesson] = useState<{
        title: string;
        type: 'VIDEO' | 'DOCUMENT' | 'QUIZ';
        duration: number;
        videoUrl: string;
        isFree: boolean;
    }>({
        title: '',
        type: 'VIDEO',
        duration: 0,
        videoUrl: '',
        isFree: false
    });
    const [lessonSource, setLessonSource] = useState<'UPLOAD' | 'LINK'>('LINK');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            let url = '';
            if (newLesson.type === 'VIDEO') {
                url = await uploadService.uploadVideo(file);
            } else if (newLesson.type === 'DOCUMENT') {
                url = await uploadService.uploadPDF(file);
            }
            setNewLesson({ ...newLesson, videoUrl: url });
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleAddLesson = async () => {
        if (!newLesson.title || (newLesson.type !== 'QUIZ' && !newLesson.videoUrl)) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            const lesson = await courseService.addLesson(unit.id, {
                ...newLesson,
                order: lessons.length + 1
            });
            setLessons([...lessons, lesson]);
            setIsAdding(false);
            setNewLesson({
                title: '',
                type: 'VIDEO',
                duration: 0,
                videoUrl: '',
                isFree: false
            });
            setLessonSource('LINK');
        } catch (error) {
            console.error('Failed to add lesson', error);
        }
    };

    return (
        <div className={styles.unitEditor}>
            <div className={styles.unitHeader}>
                <h4 className={styles.unitEditorTitle}>{unit.title}</h4>
                <button className="btn btn-outline btn-sm" onClick={() => setIsAdding(true)}>
                    <Plus size={14} /> Add Lesson
                </button>
            </div>

            <div className={styles.lessonList}>
                {lessons.map((lesson) => (
                    <div key={lesson.id} className={styles.lessonItem}>
                        <div className={styles.lessonMain}>
                            {lesson.type === 'VIDEO' ? <Video size={16} /> : <FileText size={16} />}
                            <span>{lesson.title}</span>
                        </div>
                        <div className={styles.lessonMeta}>
                            <span>{Math.floor(lesson.duration / 60)} min</span>
                            {lesson.isFree && <span className={styles.freeBadge}>Free</span>}
                        </div>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className={styles.addLessonModal}>
                    <div className={styles.modalContent}>
                        <h5>New Lesson</h5>
                        <div className={styles.formGroup}>
                            <label>Title</label>
                            <input
                                type="text"
                                value={newLesson.title}
                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Type</label>
                                <select
                                    value={newLesson.type}
                                    onChange={(e) => {
                                        const type = e.target.value as any;
                                        setNewLesson({ ...newLesson, type, videoUrl: '' });
                                        setLessonSource('LINK');
                                    }}
                                >
                                    <option value="VIDEO">Video</option>
                                    <option value="DOCUMENT">Document</option>
                                    <option value="QUIZ">Quiz/Text</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Duration (sec)</label>
                                <input
                                    type="number"
                                    value={newLesson.duration}
                                    onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        {newLesson.type !== 'QUIZ' && (
                            <div className={styles.formGroup}>
                                <label>Content Source</label>
                                <div className={styles.sourceToggle}>
                                    <button
                                        type="button"
                                        className={`${styles.sourceBtn} ${lessonSource === 'LINK' ? styles.active : ''}`}
                                        onClick={() => setLessonSource('LINK')}
                                    >
                                        <LinkIcon size={14} /> Link
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.sourceBtn} ${lessonSource === 'UPLOAD' ? styles.active : ''}`}
                                        onClick={() => setLessonSource('UPLOAD')}
                                    >
                                        <Upload size={14} /> Upload
                                    </button>
                                </div>

                                {lessonSource === 'LINK' ? (
                                    <input
                                        type="text"
                                        placeholder={newLesson.type === 'VIDEO' ? "YouTube / Vimeo URL" : "PDF URL"}
                                        value={newLesson.videoUrl}
                                        onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                        className={styles.mt2}
                                    />
                                ) : (
                                    <div className={styles.uploadArea}>
                                        <input
                                            type="file"
                                            id={`file-${unit.id}`}
                                            className={styles.hiddenInput}
                                            accept={newLesson.type === 'VIDEO' ? "video/*" : ".pdf"}
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor={`file-${unit.id}`} className={styles.uploadLabel}>
                                            {uploading ? (
                                                <span className={styles.uploadingText}>Uploading...</span>
                                            ) : newLesson.videoUrl ? (
                                                <span className={styles.uploadedText}><CheckCircle size={14} /> File Ready</span>
                                            ) : (
                                                <>
                                                    <Upload size={20} />
                                                    <span>Click to upload {newLesson.type === 'VIDEO' ? 'Video' : 'PDF'}</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                checked={newLesson.isFree}
                                onChange={(e) => setNewLesson({ ...newLesson, isFree: e.target.checked })}
                            />
                            <label>Free Preview</label>
                        </div>
                        <div className={styles.modalActions}>
                            <button className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddLesson}>Add Lesson</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
