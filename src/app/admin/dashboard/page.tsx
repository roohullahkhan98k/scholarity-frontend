"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { instructorService, InstructorApplication } from '@/services/instructorService';
import { ApplicationStatus } from '@/types';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';
import styles from './dashboard.module.css';

function AdminDashboardContent() {
    const [applications, setApplications] = useState<InstructorApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const data = await instructorService.getApplications();
            setApplications(data.applications || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id: string, status: ApplicationStatus) => {
        try {
            setProcessingId(id);
            await instructorService.reviewApplication(id, status);
            await loadApplications();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to review application');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredApplications = filter === 'ALL'
        ? applications
        : applications.filter(app => app.status === filter);

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'PENDING').length,
        approved: applications.filter(a => a.status === 'APPROVED').length,
        rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    // Pie chart data
    const pieData = [
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        { name: 'Approved', value: stats.approved, color: '#10b981' },
        { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
    ];

    // Line chart data (mock data for demonstration)
    const lineData = [
        { month: 'Jan', applications: 12, approved: 8 },
        { month: 'Feb', applications: 19, approved: 14 },
        { month: 'Mar', applications: 15, approved: 11 },
        { month: 'Apr', applications: 25, approved: 18 },
        { month: 'May', applications: 22, approved: 16 },
        { month: 'Jun', applications: stats.total, approved: stats.approved },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard Overview</h1>
                    <p className={styles.subtitle}>Monitor and manage instructor applications</p>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <div className={styles.statIcon}>
                        <BarChart3 size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Total Applications</div>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.pending}`}>
                    <div className={styles.statIcon}>
                        <Clock size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.pending}</div>
                        <div className={styles.statLabel}>Pending Review</div>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.approved}`}>
                    <div className={styles.statIcon}>
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.approved}</div>
                        <div className={styles.statLabel}>Approved</div>
                    </div>
                </div>
                <div className={`${styles.statCard} ${styles.rejected}`}>
                    <div className={styles.statIcon}>
                        <XCircle size={28} />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.rejected}</div>
                        <div className={styles.statLabel}>Rejected</div>
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
                            <Line type="monotone" dataKey="applications" stroke="#2563ea" strokeWidth={2} name="Total Applications" />
                            <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
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

            <div className={styles.applicationsSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Applications</h2>
                    <div className={styles.filters}>
                        <button
                            className={`${styles.filterBtn} ${filter === 'ALL' ? styles.active : ''}`}
                            onClick={() => setFilter('ALL')}
                        >
                            All
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === 'PENDING' ? styles.active : ''}`}
                            onClick={() => setFilter('PENDING')}
                        >
                            Pending
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === 'APPROVED' ? styles.active : ''}`}
                            onClick={() => setFilter('APPROVED')}
                        >
                            Approved
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === 'REJECTED' ? styles.active : ''}`}
                            onClick={() => setFilter('REJECTED')}
                        >
                            Rejected
                        </button>
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.tableContainer}>
                    {loading ? (
                        <div className={styles.loading}>Loading applications...</div>
                    ) : filteredApplications.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No applications found.</p>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Expertise</th>
                                    <th>Experience</th>
                                    <th>Status</th>
                                    <th>Applied</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.slice(0, 10).map((app) => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className={styles.applicantCell}>
                                                <div className={styles.applicantName}>{app.user.name}</div>
                                                <div className={styles.applicantEmail}>{app.user.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.expertise}>{app.expertise}</div>
                                        </td>
                                        <td>
                                            <div className={styles.experience}>
                                                {app.experience.length > 50
                                                    ? `${app.experience.substring(0, 50)}...`
                                                    : app.experience}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[app.status.toLowerCase()]}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.date}>
                                                {new Date(app.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td>
                                            {app.status === 'PENDING' && (
                                                <div className={styles.actions}>
                                                    <button
                                                        onClick={() => handleReview(app.id, 'APPROVED')}
                                                        disabled={processingId === app.id}
                                                        className={styles.approveBtn}
                                                    >
                                                        {processingId === app.id ? 'Processing...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReview(app.id, 'REJECTED')}
                                                        disabled={processingId === app.id}
                                                        className={styles.rejectBtn}
                                                    >
                                                        {processingId === app.id ? 'Processing...' : 'Reject'}
                                                    </button>
                                                </div>
                                            )}
                                            {app.status !== 'PENDING' && (
                                                <div className={styles.noActions}>—</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
