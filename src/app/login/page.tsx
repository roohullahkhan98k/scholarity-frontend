"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);

            // Redirect based on user role
            if (data.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else if (data.user.role === 'teacher') {
                router.push('/teacher/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className={styles.input}
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                type="password"
                                id="password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.actions}>
                            <label className={styles.remember}>
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <Link href="#" className={styles.forgot}>Forgot password?</Link>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

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
