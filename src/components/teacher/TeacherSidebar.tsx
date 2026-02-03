"use client";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    User,
    MessageSquarePlus,
    LogOut,
    ShieldCheck,
    BarChart3
} from 'lucide-react';
import styles from './TeacherSidebar.module.css';

export default function TeacherSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
        { name: 'My Courses', path: '/teacher/courses', icon: BookOpen },
        { name: 'Create Course', path: '/teacher/courses/create', icon: PlusCircle },
        { name: 'Topic Requests', path: '/teacher/dashboard/requests', icon: MessageSquarePlus },
        { name: 'My Profile', path: '/teacher/profile', icon: User },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <span className={styles.logoText}>Scholarity</span>
                <div className={styles.badge}>
                    <ShieldCheck size={12} />
                    <span>Instructor</span>
                </div>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path || (item.path !== '/teacher/dashboard' && pathname?.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <Icon className={styles.icon} size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <div className={styles.user}>
                    <div className={styles.avatar}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{user?.name}</div>
                        <div className={styles.userRole}>Verified Teacher</div>
                    </div>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
