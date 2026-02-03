"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { instructorService, InstructorApplication } from '@/services/instructorService';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Clock, CheckCircle, Plus } from 'lucide-react';
import styles from './dashboard.module.css';

import { adminService } from '@/services/adminService';

function AdminDashboardContent() {
    const [applications, setApplications] = useState<InstructorApplication[]>([]);
    const [userCount, setUserCount] = useState(0);
    const [pendingCoursesCount, setPendingCoursesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [appData, userData, courseData] = await Promise.all([
                instructorService.getApplications(),
                adminService.getUsers({ limit: 1 }),
                adminService.getPendingCourses()
            ]);

            setApplications(appData.applications || []);
            setUserCount(userData.totalUsers || 0);
            setPendingCoursesCount(Array.isArray(courseData) ? courseData.length : courseData.total || 0);
        } catch (err: any) {
            console.error('Failed to load dashboard data:', err);
            setError('Some data failed to load. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        totalApplications: applications.length,
        pendingApps: applications.filter(a => a.status === 'PENDING').length,
        totalUsers: userCount,
        pendingCourses: pendingCoursesCount,
    };

    // Pie chart data
    const pieData = [
        { name: 'Users', value: stats.totalUsers, color: '#000000' },
        { name: 'Apps', value: stats.totalApplications, color: '#2b6cb0' },
        { name: 'Courses', value: stats.pendingCourses, color: '#3b82f6' },
    ];

    // Line chart data (mock data for demonstration)
    const lineData = [
        { month: 'Jan', value: 10 },
        { month: 'Feb', value: 25 },
        { month: 'Mar', value: 18 },
        { month: 'Apr', value: 35 },
        { month: 'May', value: 30 },
        { month: 'Jun', value: stats.totalUsers },
    ];

    if (loading) {
        return <div className={styles.loading}>Loading dashboard data...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Super Admin Panel</h1>
                    <p className={styles.subtitle}>Complete platform control and monitoring</p>
                </div>
                <Link href="/courses/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} />
                    <span>Create New Course</span>
                </Link>
            </div>

            <div className={styles.stats}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <div className={styles.statIcon}>
                        <BarChart3 size={28} />
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
                        <div className={styles.statLabel}>Instructor Applications</div>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.approved}`}>
                    <div className={styles.statIcon}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.pendingCourses}</div>
                        <div className={styles.statLabel}>Courses Pending Review</div>
                    </div>
                </div>
            </div>

            <div className={styles.charts}>
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Application Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#2563ea" strokeWidth={2} name="Total Growth" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
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
