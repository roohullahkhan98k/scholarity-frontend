"use client";
import { useState, useEffect } from 'react';
import { courseService } from '@/services/courseService';
import { academicService } from '@/services/academicService';
import { Course, Category, Subject } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import {
    Search,
    Filter,
    BookOpen,
    Layers,
    ChevronRight,
    Star,
    Clock,
    Users,
    X,
    LayoutGrid,
    List
} from 'lucide-react';
import Link from 'next/link';
import styles from './courses.module.css';

export default function CoursesDiscoveryPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCourses, setTotalCourses] = useState(0);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadCourses();
    }, [debouncedSearch, selectedCategory, selectedSubject, page]);

    useEffect(() => {
        if (selectedCategory) {
            loadSubjects(selectedCategory);
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedCategory]);

    const loadInitialData = async () => {
        try {
            const catData = await academicService.getCategories();
            setCategories(catData);
        } catch (error) {
            console.error('Failed to load initial data', error);
        }
    };

    const loadSubjects = async (catId: string) => {
        try {
            const subData = await academicService.getSubjects('', catId);
            setSubjects(subData);
        } catch (error) {
            console.error('Failed to load subjects', error);
        }
    };

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await courseService.getCourses({
                search: debouncedSearch,
                categoryId: selectedCategory,
                subjectId: selectedSubject,
                status: 'APPROVED',
                page,
                limit: 12
            });
            setCourses(data.courses);
            setTotalCourses(data.total);
        } catch (error) {
            console.error('Failed to load courses', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Explore Our Curriculum</h1>
                    <p>Discover courses from world-class instructors in various categories.</p>

                    <div className={styles.searchBox}>
                        <div className={styles.searchInputWrapper}>
                            <Search className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="What do you want to learn today?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.mainLayout}>
                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterSection}>
                        <h3><Layers size={18} /> Categories</h3>
                        <div className={styles.filterList}>
                            <button
                                className={`${styles.filterItem} ${!selectedCategory ? styles.active : ''}`}
                                onClick={() => {
                                    setSelectedCategory('');
                                    setSelectedSubject('');
                                }}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`${styles.filterItem} ${selectedCategory === cat.id ? styles.active : ''}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedCategory && (
                        <div className={styles.filterSection}>
                            <h3><BookOpen size={18} /> Subjects</h3>
                            <div className={styles.filterList}>
                                <button
                                    className={`${styles.filterItem} ${!selectedSubject ? styles.active : ''}`}
                                    onClick={() => setSelectedSubject('')}
                                >
                                    All Subjects
                                </button>
                                {subjects.map(sub => (
                                    <button
                                        key={sub.id}
                                        className={`${styles.filterItem} ${selectedSubject === sub.id ? styles.active : ''}`}
                                        onClick={() => setSelectedSubject(sub.id)}
                                    >
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Course Grid */}
                <main className={styles.content}>
                    <div className={styles.contentHeader}>
                        <h2>{totalCourses} Courses available</h2>
                        <div className={styles.viewToggles}>
                            <button className={styles.active}><LayoutGrid size={18} /></button>
                            <button><List size={18} /></button>
                        </div>
                    </div>

                    {loading ? (
                        <div className={styles.grid}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonContent}>
                                        <div className={styles.skeletonTitle} />
                                        <div className={styles.skeletonText} />
                                        <div className={styles.skeletonFooter} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : courses.length > 0 ? (
                        <div className={styles.grid}>
                            {courses.map(course => (
                                <Link href={`/courses/${course.id}`} key={course.id} className={styles.courseCard}>
                                    <div className={styles.cardImage}>
                                        <img src={course.thumbnail || '/placeholder-course.jpg'} alt={course.title} />
                                        <div className={styles.badge}>{course.price === 0 ? 'Free' : `$${course.price}`}</div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3>{course.title}</h3>
                                        <p>{course.description.substring(0, 80)}...</p>
                                        <div className={styles.cardFooter}>
                                            <div className={styles.meta}>
                                                <Users size={14} /> <span>{Math.floor(Math.random() * 1000)} Students</span>
                                            </div>
                                            <div className={styles.rating}>
                                                <Star className={styles.starIcon} size={14} />
                                                <span>4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <Search size={48} className={styles.emptyIcon} />
                            <h3>No courses found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                            <button onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('');
                                setSelectedSubject('');
                            }} className="btn btn-primary">Clear all filters</button>
                        </div>
                    )}

                    {/* Pagination could go here */}
                </main>
            </div>
        </div>
    );
}
