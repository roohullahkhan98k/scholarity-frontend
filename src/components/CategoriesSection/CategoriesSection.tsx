import styles from './CategoriesSection.module.css';
import Link from 'next/link';
import { categories } from '@/data/categories';
import {
    Code, Palette, Database, TrendingUp,
    Camera, Briefcase, Music, User
} from 'lucide-react';

const iconMap: any = {
    Code, Palette, Database, TrendingUp,
    Camera, Briefcase, Music, User
};

export default function CategoriesSection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Top Categories</h2>
                </div>

                <div className={styles.grid}>
                    {categories.map((cat) => {
                        const Icon = iconMap[cat.icon] || Code;
                        return (
                            <Link href={`/courses?category=${cat.id}`} key={cat.id} className={styles.card}>
                                <div className={styles.iconWrapper} style={{ backgroundColor: `var(--bg-${cat.color}-light)`, color: `var(--text-${cat.color})` }}>
                                    <Icon size={28} />
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.name}>{cat.name}</h3>
                                    <span className={styles.count}>{cat.itemCount} Courses</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
