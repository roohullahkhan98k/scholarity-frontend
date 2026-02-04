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
    totalCourses?: number;
    applicationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}

export interface JoinInstructorDto {
    email: string;
    password?: string; // Optional if already logged in, but streamline endpoint supports guests
    name: string;
    bio: string;
    expertise: string;
    experience: string;
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

export interface TeacherProfileResponse {
    profile: {
        bio: string;
        expertise: string;
        experience: string;
    };
    verification: {
        status: 'PENDING' | 'APPROVED' | 'REJECTED';
        rejectionReason: string | null;
    };
}

export const teacherService = {
    // 2.1 Teacher Profile (GET /teacher/profile)
    async getTeacherProfile(): Promise<TeacherProfileResponse> {
        const response = await api.get('/teacher/profile');
        return response.data;
    },

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

    // 2.1 Join as Instructor (POST /instructor/join)
    async joinInstructor(data: JoinInstructorDto) {
        const response = await api.post('/instructor/join', data);
        return response.data;
    },

    // Delete teacher (Admin only)
    async deleteTeacher(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/teachers/${id}`);
        return response.data;
    },
};
