import api from '@/lib/api';
import { Course, CreateCourseDto } from '@/types';

export interface Unit {
    id: string;
    courseId: string;
    title: string;
    order: number;
}

export interface Lesson {
    id: string;
    unitId: string;
    title: string;
    order: number;
    type: 'VIDEO' | 'DOCUMENT' | 'QUIZ';
    contentUrl: string;
}

export interface ApprovalLog {
    action: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    comment: string | null;
    createdAt: string;
}

export const courseService = {
    // 2.1 Create Course Draft (POST /api/courses)
    async createCourse(data: CreateCourseDto): Promise<Course> {
        const response = await api.post('/courses', data);
        return response.data;
    },

    // 2.2 Update Course Draft (PUT /api/courses/:id)
    async updateCourse(id: string, data: Partial<CreateCourseDto>): Promise<Course> {
        const response = await api.put(`/courses/${id}`, data);
        return response.data;
    },

    // 2.2 Add Unit (Chapter) (POST /api/courses/:courseId/units)
    async addUnit(courseId: string, title: string, order: number): Promise<Unit> {
        const response = await api.post(`/courses/${courseId}/units`, { title, order });
        return response.data;
    },

    // 2.3 Add Lesson to Unit (POST /api/courses/:unitId/lessons)
    // 2.3 Add Lesson to Unit (POST /api/courses/:unitId/lessons)
    async addLesson(unitId: string, data: { title: string; type: string; videoUrl?: string; resources?: any[]; order: number }): Promise<Lesson> {
        const response = await api.post(`/courses/${unitId}/lessons`, data);
        return response.data;
    },

    // 2.3.1 Update Lesson (PUT /api/courses/lessons/:lessonId)
    async updateLesson(lessonId: string, data: { title: string; type: string; resources: any[] }): Promise<Lesson> {
        const response = await api.put(`/courses/lessons/${lessonId}`, data);
        return response.data;
    },

    // 2.4 Submit for Review (POST /api/courses/:courseId/submit)
    async submitForReview(courseId: string): Promise<void> {
        await api.post(`/courses/${courseId}/submit`);
    },

    // 5.1 View Multi-Step Approval Logs (GET /api/admin/courses/:id/logs)
    async getApprovalLogs(courseId: string): Promise<ApprovalLog[]> {
        const response = await api.get(`/admin/courses/${courseId}/logs`);
        return response.data;
    },

    // Admin: Get Admin Courses (optionally filtered by teacherId)
    async getAdminCourses(params?: { teacherId?: string; search?: string; categoryId?: string }): Promise<Course[]> {
        const response = await api.get('/courses', { params });
        // Robust data extraction
        if (Array.isArray(response.data)) return response.data;
        if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
        if (response.data?.courses && Array.isArray(response.data.courses)) return response.data.courses;
        return [];
    },

    // Admin: Bulk Delete Courses
    async bulkDeleteCourses(params: { courseIds?: string[]; deleteAll?: boolean }): Promise<void> {
        await api.post('/courses/bulk-delete', params);
    },

    // Admin: Delete Course
    async deleteCourse(id: string): Promise<void> {
        await api.delete(`/courses/${id}`);
    },

    // Admin: Toggle Course Status
    async toggleStatus(id: string): Promise<{ status: string }> {
        const response = await api.patch(`/courses/${id}/status`);
        return response.data;
    },

    // Get course by ID (for editing/details)
    async getCourse(id: string): Promise<Course> {
        const response = await api.get(`/courses/${id}`);
        // Support nested response if API changes
        if (response.data?.course) return response.data.course;
        return response.data;
    },

    // Get teacher's courses (implied)
    async getMyCourses(): Promise<Course[]> {
        const response = await api.get('/courses/my');
        return response.data;
    }
};
