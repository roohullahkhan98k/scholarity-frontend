import styles from './ReviewCard.module.css';
import { Review } from '@/data/reviews';

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <img src={review.avatarUrl} alt={review.studentName} className={styles.avatar} />
                <div className={styles.info}>
                    <h4 className={styles.name}>{review.studentName}</h4>
                    <span className={styles.date}>{review.date}</span>
                </div>
            </div>
            <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
            </div>
            <p className={styles.comment}>"{review.comment}"</p>
            <div className={styles.teacherLink}>
                Student of <span className={styles.teacherName}>{review.teacherName}</span>
            </div>
        </div>
    );
}
