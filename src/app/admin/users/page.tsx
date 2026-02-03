"use client";
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { adminService } from '@/services/adminService';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Users, Search, Filter, Shield, UserX, UserCheck } from 'lucide-react';
import { User, RoleName } from '@/types';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton/LoadingButton';
import styles from './users.module.css';

function UsersPageContent() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, [page]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getUsers({ page, limit: 10, search });
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            setProcessingId(id);
            await adminService.toggleUserStatus(id, !currentStatus);
            toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            await loadUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    const handleChangeRole = async (id: string, roleName: RoleName) => {
        if (!confirm(`Are you sure you want to change this user's role to ${roleName}?`)) return;

        try {
            toast.loading('Updating role...', { id: 'role-update' });
            await adminService.changeUserRole(id, roleName);
            toast.success('Role updated successfully', { id: 'role-update' });
            await loadUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to change role', { id: 'role-update' });
        }
    };

    const columns: Column<User>[] = [
        {
            key: 'name',
            header: 'User',
            width: '25%',
            render: (row) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{row.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{row.email}</div>
                </div>
            )
        },
        {
            key: 'role',
            header: 'Role',
            width: '15%',
            render: (row) => (
                <span className={`${styles.badge} ${styles[row.role.name.toLowerCase()]}`}>
                    {row.role.name}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            width: '15%',
            render: (row) => (
                <span className={`${styles.status} ${row.isActive ? styles.active : styles.inactive}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '30%',
            render: (row) => (
                <div className={styles.actions}>
                    <LoadingButton
                        onClick={() => handleToggleStatus(row.id, row.isActive)}
                        className={row.isActive ? styles.deactivateBtn : styles.activateBtn}
                        title={row.isActive ? 'Deactivate' : 'Activate'}
                        isLoading={processingId === row.id}
                        loadingText=""
                        size="sm"
                    >
                        {row.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        <span>{row.isActive ? 'Deactivate' : 'Activate'}</span>
                    </LoadingButton>

                    <select
                        value={row.role.name}
                        onChange={(e) => handleChangeRole(row.id, e.target.value as RoleName)}
                        className={styles.roleSelect}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                </div>
            )
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <div className={styles.iconWrapper}>
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className={styles.title}>User Management</h1>
                        <p className={styles.subtitle}>Manage platform users, roles, and status</p>
                    </div>
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && loadUsers()}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={users}
                loading={loading}
                emptyMessage="No users found."
                pageSize={10}
            />
        </div>
    );
}

export default function UsersPage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <UsersPageContent />
        </ProtectedRoute>
    );
}
