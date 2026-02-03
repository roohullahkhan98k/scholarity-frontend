import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.heroContainer}`}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Unlock Your Potential with <span className="text-gradient">Expert Tutors</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Connect with world-class educators and learn at your own pace.
                        From coding to calculus, master any subject with personalized guidance.
                    </p>
                    <div className={styles.ctaGroup}>
                        <Link href="/browse" className="btn btn-primary">Start Learning</Link>
                        <Link href="/browse" className={`btn ${styles.secondaryBtn}`}>View Tutors</Link>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    {/* Abstract visual representation instead of a heavy image for now, or placeholder */}
                    <div className={styles.abstractShape1}></div>
                    <div className={styles.abstractShape2}></div>
                    <div className={styles.heroImagePlaceholder}>
                        <span>Interactive Learning</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
