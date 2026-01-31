"use client";
import Link from 'next/link';
import styles from './instructor.module.css';

export default function BecomeInstructorPage() {
    return (
        <>
            <Link href="/" className={styles.logoHeader}>
                <span className={styles.logoText}>Scholarity</span>
            </Link>

            <div className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1 className={styles.title}>Share your knowledge,<br />inspire the world.</h1>
                        <p className={styles.subtitle}>
                            Join our community of expert instructors and earn money doing what you love.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.benefits}>
                        <h2 className={styles.sectionTitle}>Why teach on Scholarity?</h2>

                        <div className={styles.benefitItem}>
                            <div className={styles.icon}>🌍</div>
                            <div>
                                <h3>Global Reach</h3>
                                <p>Connect with students from over 180 countries.</p>
                            </div>
                        </div>

                        <div className={styles.benefitItem}>
                            <div className={styles.icon}>💰</div>
                            <div>
                                <h3>Earn Money</h3>
                                <p>Set your own rates and get paid securely.</p>
                            </div>
                        </div>

                        <div className={styles.benefitItem}>
                            <div className={styles.icon}>⏰</div>
                            <div>
                                <h3>Flexible Schedule</h3>
                                <p>Work on your own terms, from anywhere.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h3 className={styles.formTitle}>Apply Now</h3>
                        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.formGroup}>
                                <label>Professional Headline</label>
                                <input type="text" placeholder="e.g. Senior Software Engineer" />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Expertise Area</label>
                                <select>
                                    <option>Select a subject...</option>
                                    <option>Computer Science</option>
                                    <option>Mathematics</option>
                                    <option>Language</option>
                                    <option>Business</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Bio / Experience</label>
                                <textarea rows={4} placeholder="Tell us about your teaching experience..."></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
