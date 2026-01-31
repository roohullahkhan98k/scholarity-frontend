export type UserRole = 'admin' | 'teacher' | 'student';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
}

export interface AuthResponse {
    access_token: string;
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
