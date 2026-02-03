import api from '@/lib/api';
import { Course, CreateCourseDto, Unit, Lesson } from '@/types';

export const courseService = {
    // 2.2 Create Course Draft (POST /courses)
    async createCourse(data: CreateCourseDto): Promise<Course> {
        const response = await api.post('/courses', data);
        return response.data;
    },

    // 2.3 Add Content (Units)
    async addUnit(courseId: string, data: { title: string; order: number }): Promise<Unit> {
        const response = await api.post(`/courses/${courseId}/units`, data);
        return response.data;
    },

    // 2.3 Add Content (Lessons)
    async addLesson(unitId: string, data: Partial<Lesson>): Promise<Lesson> {
        const response = await api.post(`/courses/${unitId}/lessons`, data);
        return response.data;
    },

    // 3.1 Submit for Review (POST /courses/:id/submit)
    async submitForReview(courseId: string): Promise<Course> {
        const response = await api.post(`/courses/${courseId}/submit`);
        return response.data;
    },

    // 4.1 Get My Courses (GET /courses/my-courses)
    async getMyCourses(): Promise<Course[]> {
        const response = await api.get('/courses/my-courses');
        return response.data;
    },

    // Phase 4: Course Search & Filter (GET /courses)
    async getCourses(params: {
        search?: string;
        categoryId?: string;
        subjectId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const response = await api.get('/courses', { params });
        return response.data;
    },

    // 4.1 Get Course by ID (GET /courses/:id)
    async getCourseById(id: string): Promise<Course & { units: (Unit & { lessons: Lesson[] })[] }> {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    }
};
