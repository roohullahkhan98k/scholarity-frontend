import api from '@/lib/api';
import { ApplicationStatus } from '@/types';

export interface ApplyInstructorData {
    bio: string;
    expertise: string;
    experience: string;
}

export interface InstructorApplication {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    bio: string;
    expertise: string;
    experience: string;
    status: ApplicationStatus;
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export const instructorService = {
    // Apply to become instructor (student only)
    async apply(data: ApplyInstructorData) {
        const response = await api.post('/instructor/apply', data);
        return response.data;
    },

    // Get all applications (admin only)
    async getApplications(status?: ApplicationStatus) {
        const params = status ? { status } : {};
        const response = await api.get('/instructor/applications', { params });
        return response.data;
    },

    // Review application (admin only)
    async reviewApplication(
        id: string,
        status: ApplicationStatus,
        rejectionReason?: string
    ) {
        const response = await api.patch(`/instructor/applications/${id}`, {
            status,
            rejectionReason,
        });
        return response.data;
    },
};
