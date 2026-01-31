import styles from './TeacherCard.module.css';
import { Teacher } from '@/data/teachers';

interface TeacherCardProps {
    teacher: Teacher;
}

export default function TeacherCard({ teacher }: TeacherCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <img src={teacher.imageUrl} alt={teacher.name} className={styles.image} />
                <div className={styles.hourlyRate}>${teacher.hourlyRate}/hr</div>
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.name}>{teacher.name}</h3>
                    <div className={styles.rating}>
                        <span className={styles.star}>★</span>
                        <span className={styles.ratingValue}>{teacher.rating}</span>
                        <span className={styles.reviewCount}>({teacher.reviewCount})</span>
                    </div>
                </div>
                <p className={styles.subject}>{teacher.subject}</p>
                <button className={`btn btn-outline ${styles.profileBtn}`}>View Profile</button>
            </div>
        </div>
    );
}
