import api from '@/lib/api';

export interface Student {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    bio: string;
    interests: string;
    enrolledCourses: number;
    completedCourses: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStudentDto {
    userId: string;
    bio: string;
    interests: string;
}

export interface UpdateStudentDto {
    bio?: string;
    interests?: string;
    enrolledCourses?: number;
    completedCourses?: number;
}

export interface StudentProfileResponse {
    profile: {
        bio: string;
        interests: string;
    };
    activity: {
        enrolledCourses: number;
        completedCourses: number;
    };
}

export const studentService = {
    // Student Profile (GET /student/profile)
    async getStudentProfile(): Promise<StudentProfileResponse> {
        const response = await api.get('/student/profile');
        return response.data;
    },
    // Get all students
    async getStudents(): Promise<Student[]> {
        const response = await api.get('/students');
        return response.data;
    },

    // Get student by ID
    async getStudent(id: string): Promise<Student> {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    // Create student profile (Admin only)
    async createStudent(data: CreateStudentDto): Promise<Student> {
        const response = await api.post('/students', data);
        return response.data;
    },

    // Update student (Admin only)
    async updateStudent(id: string, data: UpdateStudentDto): Promise<Student> {
        const response = await api.patch(`/students/${id}`, data);
        return response.data;
    },

    // Delete student (Admin only)
    async deleteStudent(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },
};
