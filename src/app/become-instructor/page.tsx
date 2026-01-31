"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './instructor.module.css';
import { instructorService } from '@/services/instructorService';

export default function BecomeInstructorPage() {
    const [formData, setFormData] = useState({
        bio: '',
        expertise: '',
        experience: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await instructorService.apply(formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Application failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <Link href="/" className={styles.logoHeader}>
                    <span className={styles.logoText}>Scholarity</span>
                </Link>

                <div className={styles.hero}>
                    <div className="container">
                        <div className={styles.heroContent}>
                            <h1 className={styles.title}>Application Submitted!</h1>
                            <p className={styles.subtitle}>
                                Your application is under review. We'll notify you once it's processed.
                            </p>
                            <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                                Return to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

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
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Bio / About You</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about yourself (min 50 characters)"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    minLength={50}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Expertise Area</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Mathematics, Computer Science"
                                    value={formData.expertise}
                                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                    minLength={10}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Teaching / Work Experience</label>
                                <textarea
                                    rows={4}
                                    placeholder="Your teaching/work experience (min 50 characters)"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    minLength={50}
                                    required
                                />
                            </div>

                            {error && <p className={styles.error}>{error}</p>}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
