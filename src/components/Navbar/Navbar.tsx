"use client";
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    Scholarity
                </Link>

                <div className={styles.searchBar}>
                    <input type="text" placeholder="Search for anything..." />
                    <button className={styles.searchBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>

                <ul className={styles.navLinks}>
                    <li>
                        <Link href="/courses" className={styles.navLink}>Browse Courses</Link>
                    </li>
                    {!user ? (
                        <>
                            <li>
                                <Link href="/become-instructor" className={styles.navLink}>Teach with Us</Link>
                            </li>
                            <li>
                                <Link href="/login" className="btn btn-outline">Log in</Link>
                            </li>
                            <li>
                                <Link href="/signup" className="btn btn-primary">Sign up</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={styles.userSection}>
                                <div className={styles.avatar}>
                                    {user.name?.charAt(0).toUpperCase() || <UserIcon size={18} />}
                                </div>
                                <span className={styles.userName}>{user.name}</span>
                            </li>
                            <li>
                                <button onClick={() => logout()} className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem' }}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
