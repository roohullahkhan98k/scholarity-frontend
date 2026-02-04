"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { instructorService, InstructorApplication } from '@/services/instructorService';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Clock, CheckCircle, Plus, Users as UsersIcon, Layout, TrendingUp } from 'lucide-react';
import styles from './dashboard.module.css';
import { adminService } from '@/services/adminService';

function DashboardSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={`${styles.skeleton} ${styles.skeletonPulse} ${styles.skeletonHeader}`}></div>
                    <div className={`${styles.skeleton} ${styles.skeletonPulse} ${styles.skeletonSubtitle}`}></div>
                </div>
            </div>

            <div className={styles.stats}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.skeletonPulse} ${styles.skeletonStat}`}></div>
                ))}
            </div>

            <div className={styles.charts}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${styles.skeleton} ${styles.skeletonPulse} ${styles.skeletonChart}`}></div>
                ))}
            </div>
        </div>
    );
}

function AdminDashboardContent() {
    const [applications, setApplications] = useState<InstructorApplication[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [userCount, setUserCount] = useState(0);
    const [pendingCoursesCount, setPendingCoursesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [appData, userData, courseData] = await Promise.all([
                instructorService.getApplications(),
                adminService.getUsers({ limit: 100 }), // Fetch more for analytics
                adminService.getPendingCourses()
            ]);

            setApplications(appData.applications || appData || []);
            setUsers(userData.users || userData || []);

            // Fix: API returns totalPages/users or totalUsers. Handle both.
            const total = userData.totalUsers || userData.total || (userData.totalPages ? userData.totalPages * 10 : userData.users?.length || 0);
            setUserCount(total);

            setPendingCoursesCount(Array.isArray(courseData) ? courseData.length : courseData.total || 0);
        } catch (err: any) {
            console.error('Failed to load dashboard data:', err);
            setError('Some data failed to load. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const processGrowthData = (data: any[], range: string) => {
        const now = new Date();
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
        const result: { date: string; value: number }[] = [];

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const count = (data || []).filter(item => {
                if (!item.createdAt) return false;
                const itemDate = new Date(item.createdAt);
                return itemDate.toDateString() === date.toDateString();
            }).length;

            const prevValue = result.length > 0 ? result[result.length - 1].value : 0;
            result.push({ date: dateStr, value: prevValue + count });
        }
        return result;
    };

    const stats = {
        totalApplications: applications.length,
        pendingApps: applications.filter(a => a.status === 'PENDING').length,
        totalUsers: userCount,
        pendingCourses: pendingCoursesCount,
    };

    const appGrowthData = processGrowthData(applications, timeRange);
    const userGrowthData = processGrowthData(users, timeRange);

    const pieData = [
        { name: 'Pending', value: applications.filter(a => a.status === 'PENDING').length, color: '#f59e0b' },
        { name: 'Approved', value: applications.filter(a => a.status === 'APPROVED').length, color: '#10b981' },
        { name: 'Rejected', value: applications.filter(a => a.status === 'REJECTED').length, color: '#ef4444' },
    ];

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Super Admin Panel</h1>
                    <p className={styles.subtitle}>Platform-wide monitoring and quick actions</p>
                </div>
                <div className={styles.quickActions}>
                    <Link href="/admin/users" className={styles.quickActionBtn}>
                        <UsersIcon size={16} />
                        <span>Manage Users</span>
                    </Link>
                    <Link href="/admin/teachers" className={styles.quickActionBtn}>
                        <Layout size={16} />
                        <span>Instructors</span>
                    </Link>
                    <Link href="/admin/courses/create" className={`${styles.quickActionBtn} ${styles.primaryAction}`}>
                        <Plus size={16} />
                        <span>New Course</span>
                    </Link>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <div className={styles.statIcon}>
                        <UsersIcon size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.totalUsers}</div>
                        <div className={styles.statLabel}>Total Platform Users</div>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.pending}`}>
                    <div className={styles.statIcon}>
                        <Clock size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.pendingApps}</div>
                        <div className={styles.statLabel}>Pending Applications</div>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.approved}`}>
                    <div className={styles.statIcon}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.pendingCourses}</div>
                        <div className={styles.statLabel}>Courses to Review</div>
                    </div>
                </div>
            </div>

            <div className={styles.charts}>
                {/* User Growth Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Platform Growth</h2>
                        <div className={styles.timeRangeSelector}>
                            <button
                                className={`${styles.timeRangeBtn} ${timeRange === '7d' ? styles.active : ''}`}
                                onClick={() => setTimeRange('7d')}
                            >
                                7D
                            </button>
                            <button
                                className={`${styles.timeRangeBtn} ${timeRange === '30d' ? styles.active : ''}`}
                                onClick={() => setTimeRange('30d')}
                            >
                                30D
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Application Growth Chart */}
                <div className={styles.chartCard} style={{ gridColumn: 'span 1' }}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Application Trends</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={appGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} name="Apps" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Quality Distribution Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h2 className={styles.chartTitle}>Application Quality</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
