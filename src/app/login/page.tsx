"use client";
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logoHeader}>
                <span className={styles.logoText}>Scholarity</span>
            </Link>

            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Welcome back</h1>
                        <p className={styles.subtitle}>Please enter your details to sign in.</p>
                    </div>

                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input type="email" id="email" className={styles.input} placeholder="john@example.com" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input type="password" id="password" className={styles.input} placeholder="••••••••" />
                        </div>

                        <div className={styles.actions}>
                            <label className={styles.remember}>
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link href="#" className={styles.forgot}>Forgot password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign in</button>

                        <button type="button" className={`btn btn-outline ${styles.googleBtn}`} style={{ width: '100%', marginTop: '1rem' }}>
                            Sign in with Google
                        </button>
                    </form>

                    <p className={styles.footer}>
                        Don't have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
                    </p>
                </div>
            </div>

            <div className={styles.imageSection}>
                <div className={styles.imageContent}>
                    <h2>Learn without limits</h2>
                    <p>Join millions of students and instructors on the world's leading learning platform.</p>
                </div>
            </div>
        </div>
    );
}
