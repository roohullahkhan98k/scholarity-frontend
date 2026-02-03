import api from '@/lib/api';
import { User, RoleName } from '@/types';

export const adminService = {
    // 1.2 User Management (GET /admin/users)
    async getUsers(params?: { page?: number; limit?: number; search?: string; roleId?: string }) {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    // 1.3 Toggle User Status (PATCH /admin/users/:id/status)
    async toggleUserStatus(id: string, isActive: boolean) {
        const response = await api.patch(`/admin/users/${id}/status`, { isActive });
        return response.data;
    },

    // 1.4 Change User Role (PATCH /admin/users/:id/role)
    async changeUserRole(id: string, roleName: RoleName) {
        const response = await api.patch(`/admin/users/${id}/role`, { roleName });
        return response.data;
    },

    // 3.2 List Pending Courses (GET /admin/courses/pending)
    async getPendingCourses(params?: { page?: number; limit?: number }) {
        const response = await api.get('/admin/courses/pending', { params });
        return response.data;
    },

    // 3.3 Approve Course (POST /admin/courses/:id/approve)
    async approveCourse(id: string) {
        const response = await api.post(`/admin/courses/${id}/approve`);
        return response.data;
    },

    // 3.3 Reject Course (POST /admin/courses/:id/reject)
    async rejectCourse(id: string, reason: string) {
        const response = await api.post(`/admin/courses/${id}/reject`, { reason });
        return response.data;
    },

    // 3.4 Approval Audit Trail (GET /admin/courses/:id/logs)
    async getCourseLogs(id: string) {
        const response = await api.get(`/admin/courses/${id}/logs`);
        return response.data;
    }
};
