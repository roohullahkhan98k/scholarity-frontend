"use client";
import Link from 'next/link';
import styles from '../login/login.module.css'; // Reuse login styles

export default function SignUpPage() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logoHeader}>
                <span className={styles.logoText}>Scholarity</span>
            </Link>

            <div className={styles.imageSection} style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}>
                <div className={styles.imageContent}>
                    <h2>Start your journey</h2>
                    <p>Create an account today and get access to thousands of expert-led courses.</p>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Create Account</h1>
                        <p className={styles.subtitle}>Sign up to get started with Scholarity.</p>
                    </div>

                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name" className={styles.label}>Full Name</label>
                            <input type="text" id="name" className={styles.input} placeholder="John Doe" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input type="email" id="email" className={styles.input} placeholder="john@example.com" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input type="password" id="password" className={styles.input} placeholder="••••••••" />
                        </div>

                        <div className={styles.actions}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                By signing up, you agree to our <Link href="#" className={styles.link}>Terms</Link> and <Link href="#" className={styles.link}>Privacy Policy</Link>.
                            </p>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>

                        <button type="button" className={`btn btn-outline ${styles.googleBtn}`} style={{ width: '100%', marginTop: '1rem' }}>
                            Sign up with Google
                        </button>
                    </form>

                    <p className={styles.footer}>
                        Already have an account? <Link href="/login" className={styles.link}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
