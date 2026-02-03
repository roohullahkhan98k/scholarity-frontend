"use client";
import { useState, useEffect } from 'react';
import styles from './browse.module.css';
import TeacherCard from '@/components/TeacherCard/TeacherCard';
import { teachers } from '@/data/teachers';
import { academicService, Category } from '@/services/academicService';

// Extending the teacher list for demonstration
const allTeachers = [
    ...teachers,
    ...teachers.map(t => ({ ...t, id: t.id + '_dup', name: t.name + ' (Copy)' }))
];

export default function BrowsePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await academicService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 className={styles.pageTitle}>Find your perfect tutor</h1>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    {loading ? (
                        <p>Loading categories...</p>
                    ) : (
                        categories.map((cat) => (
                            <div key={cat.id} className={styles.filterGroup}>
                                <h3>{cat.name}</h3>
                                {cat.subjects.map((sub) => (
                                    <label key={sub.id}>
                                        <input type="checkbox" value={sub.id} /> {sub.name}
                                    </label>
                                ))}
                            </div>
                        ))
                    )}

                    <div className={styles.filterGroup}>
                        <h3>Price Range</h3>
                        <label><input type="radio" name="price" /> Under $30</label>
                        <label><input type="radio" name="price" /> $30 - $60</label>
                        <label><input type="radio" name="price" /> $60+</label>
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
