"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/login.module.css';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await signup(email, password, name);

            // Redirect based on user role (new users are students by default)
            if (data.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else if (data.user.role === 'teacher') {
                router.push('/teacher/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name" className={styles.label}>Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className={styles.input}
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                                minLength={6}
                            />
                        </div>

                        <div className={styles.actions}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                By signing up, you agree to our <Link href="#" className={styles.link}>Terms</Link> and <Link href="#" className={styles.link}>Privacy Policy</Link>.
                            </p>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

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
