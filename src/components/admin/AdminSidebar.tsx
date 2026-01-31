"use client";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, FileText, Users, TrendingUp, Settings, LogOut } from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Applications', path: '/admin/applications', icon: FileText },
        { name: 'Teachers', path: '/admin/teachers', icon: Users },
        { name: 'Students', path: '/admin/students', icon: Users },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>
                <span className={styles.logoText}>Scholarity</span>
                <span className={styles.badge}>Admin</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                        >
                            <Icon className={styles.icon} size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <div className={styles.user}>
                    <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>{user?.name}</div>
                        <div className={styles.userRole}>Administrator</div>
                    </div>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
