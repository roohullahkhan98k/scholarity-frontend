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
    async addLesson(unitId: string, data: { title: string; type: string; videoUrl?: string; resources?: string[]; order: number }): Promise<Lesson> {
        const response = await api.post(`/courses/${unitId}/lessons`, data);
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

    // Get course by ID (for editing/details)
    async getCourse(id: string): Promise<Course> {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    // Get teacher's courses (implied)
    async getMyCourses(): Promise<Course[]> {
        const response = await api.get('/courses/my');
        return response.data;
    }
};
