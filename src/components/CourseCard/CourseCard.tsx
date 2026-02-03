import styles from './CourseCard.module.css';
import { Star, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CourseProps {
    course: {
        id: string;
        title: string;
        instructor: string;
        rating: number;
        ratingCount: number;
        price: number;
        image: string;
        category: string;
        duration: string;
        lessons: number;
    };
}

export default function CourseCard({ course }: CourseProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className={styles.categoryBadge}>{course.category}</span>
            </div>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <div className={styles.rating}>
                        <Star size={16} fill="currentColor" />
                        <span>{course.rating}</span>
                        <span className={styles.ratingCount}>({course.ratingCount})</span>
                    </div>
                </div>

                <h3 className={styles.title}>
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                </h3>
                <p className={styles.instructor}>By {course.instructor}</p>

                <div className={styles.meta} style={{ marginTop: 'auto', marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        <span>{course.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <BookOpen size={14} />
                        <span>{course.lessons} lectures</span>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.price}>${course.price}</div>
                    <Link href={`/courses/${course.id}`} className={styles.btn}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
