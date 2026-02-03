"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import { Plus, BookOpen, Clock, CheckCircle, XCircle, Search, Filter, MoreVertical, Edit, Eye } from 'lucide-react';
import styles from './courses.module.css';
import { motion } from 'framer-motion';

function MyCoursesPageContent() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await courseService.getMyCourses();
            setCourses(data || []);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className={`${styles.badge} ${styles.approved}`}><CheckCircle size={12} /> Live</span>;
            case 'PENDING': return <span className={`${styles.badge} ${styles.pending}`}><Clock size={12} /> Reviewing</span>;
            case 'REJECTED': return <span className={`${styles.badge} ${styles.rejected}`}><XCircle size={12} /> Rejected</span>;
            default: return <span className={`${styles.badge} ${styles.draft}`}>Draft</span>;
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>My Courses</h1>
                    <p className={styles.subtitle}>Manage and track your educational content.</p>
                </div>
                <Link href="/teacher/courses/create" className={styles.primaryBtn}>
                    <Plus size={18} />
                    <span>Create New Course</span>
                </Link>
            </div>

            <div className={styles.searchBar}>
                <div className={styles.searchInner}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search your courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <button className={styles.filterBtn}>
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading courses...</div>
            ) : filteredCourses.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📚</div>
                    <h3>No courses found</h3>
                    <p>{searchTerm ? "No results match your search." : "You haven't created any courses yet. Start by creating your first course draft!"}</p>
                    <Link href="/teacher/courses/create" className={styles.primaryBtn} style={{ marginTop: '1.5rem' }}>
                        Create First Course
                    </Link>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.courseTable}>
                        <thead>
                            <tr>
                                <th>Course Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Students</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
                                <motion.tr
                                    key={course.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={styles.courseRow}
                                >
                                    <td>
                                        <div className={styles.courseInfo}>
                                            <div className={styles.courseThumbSmall}>
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt={course.title} />
                                                ) : (
                                                    <BookOpen size={16} />
                                                )}
                                            </div>
                                            <span className={styles.courseTitleText}>{course.title}</span>
                                        </div>
                                    </td>
                                    <td><span className={styles.categoryBadge}>Education</span></td>
                                    <td><span className={styles.priceText}>${course.price}</span></td>
                                    <td>{getStatusBadge(course.status)}</td>
                                    <td><span className={styles.studentCount}>0</span></td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <Link
                                                href={course.status === 'DRAFT' ? `/teacher/courses/create?id=${course.id}` : `/teacher/courses/${course.id}/edit`}
                                                className={styles.iconAction}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <Link
                                                href={`/teacher/courses/${course.id}`}
                                                className={styles.iconAction}
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                className={styles.iconAction}
                                                title="More"
                                                onClick={() => {/* Toggle Menu */ }}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default function MyCoursesPage() {
    return (
        <ProtectedRoute requiredRole="TEACHER">
            <MyCoursesPageContent />
        </ProtectedRoute>
    );
}
