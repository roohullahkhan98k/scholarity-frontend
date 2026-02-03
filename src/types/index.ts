export type RoleName = 'STUDENT' | 'TEACHER' | 'SUPER_ADMIN';

export interface Role {
    id?: string;
    name: RoleName;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    isActive: boolean;
}

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AuthResponse {
    token: string;
    user: User;
}

export interface SignupData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface Subject {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    subjects: Subject[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    subjectId: string;
    price: number;
    thumbnail: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CreateCourseDto {
    title: string;
    description: string;
    categoryId: string;
    subjectId: string;
    price: number;
    thumbnail: string;
}

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
    duration: number;
    videoUrl?: string;
    resources?: { title: string; url: string; type: string }[];
    isFree: boolean;
}
