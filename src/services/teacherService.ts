import api from '@/lib/api';

export interface Teacher {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    bio: string;
    expertise: string;
    experience: string;
    rating: number;
    totalStudents: number;
    applicationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeacherDto {
    userId: string;
    bio: string;
    expertise: string;
    experience: string;
}

export interface UpdateTeacherDto {
    bio?: string;
    expertise?: string;
    experience?: string;
    rating?: number;
    totalStudents?: number;
}

export const teacherService = {
    // Get all teachers
    async getTeachers(): Promise<Teacher[]> {
        const response = await api.get('/teachers');
        return response.data;
    },

    // Get teacher by ID
    async getTeacher(id: string): Promise<Teacher> {
        const response = await api.get(`/teachers/${id}`);
        return response.data;
    },

    // Create teacher profile (Admin only)
    async createTeacher(data: CreateTeacherDto): Promise<Teacher> {
        const response = await api.post('/teachers', data);
        return response.data;
    },

    // Update teacher (Admin only)
    async updateTeacher(id: string, data: UpdateTeacherDto): Promise<Teacher> {
        const response = await api.patch(`/teachers/${id}`, data);
        return response.data;
    },

    // Delete teacher (Admin only)
    async deleteTeacher(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/teachers/${id}`);
        return response.data;
    },
};
