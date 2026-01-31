import styles from './browse.module.css';
import TeacherCard from '@/components/TeacherCard/TeacherCard';
import { teachers } from '@/data/teachers';

// Extending the teacher list for demonstration
const allTeachers = [
    ...teachers,
    ...teachers.map(t => ({ ...t, id: t.id + '_dup', name: t.name + ' (Copy)' }))
];

export default function BrowsePage() {
    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 className={styles.pageTitle}>Find your perfect tutor</h1>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <div className={styles.filterGroup}>
                        <h3>Subject</h3>
                        <label><input type="checkbox" /> Mathematics</label>
                        <label><input type="checkbox" /> Computer Science</label>
                        <label><input type="checkbox" /> English</label>
                        <label><input type="checkbox" /> Physics</label>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3>Price Range</h3>
                        <label><input type="radio" name="price" /> Under $30</label>
                        <label><input type="radio" name="price" /> $30 - $60</label>
                        <label><input type="radio" name="price" /> $60+</label>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3>Availability</h3>
                        <label><input type="checkbox" /> Available Now</label>
                        <label><input type="checkbox" /> Weekends</label>
                    </div>
                </aside>

                <main className={styles.grid}>
                    {allTeachers.map((teacher) => (
                        <TeacherCard key={teacher.id} teacher={teacher} />
                    ))}
                </main>
            </div>
        </div>
    );
}
