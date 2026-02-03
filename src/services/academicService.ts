import api from '@/lib/api';

export interface AcademicRequest {
    id: string;
    type: 'CATEGORY' | 'SUBJECT';
    name: string;
    description?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason?: string;
    teacher: {
        id: string;
        name: string;
        email: string;
    };
    categoryId?: string; // Only for SUBJECT requests
    createdAt: string;
}

export const academicService = {
    // 1.1 Academic Categories (GET /academic/categories)
    async getCategories(search?: string) {
        const params = search ? { search } : {};
        const response = await api.get('/academic/categories', { params });
        return response.data;
    },

    // 2. Search & Filter Utility (GET /academic/subjects)
    async getSubjects(search?: string, categoryId?: string) {
        const params: any = {};
        if (search) params.search = search;
        if (categoryId) params.categoryId = categoryId;
        const response = await api.get('/academic/subjects', { params });
        return response.data;
    },

    // 1.1 Create Category (Admin Only)
    async createCategory(name: string) {
        const response = await api.post('/academic/categories', { name });
        return response.data;
    },

    // 1.1 Create Subject (Admin Only)
    async createSubject(name: string, categoryId: string) {
        const response = await api.post('/academic/subjects', { name, categoryId });
        return response.data;
    },

    // Edit/Delete Categories
    async updateCategory(id: string, name: string) {
        const response = await api.put(`/academic/categories/${id}`, { name });
        return response.data;
    },

    async deleteCategory(id: string) {
        const response = await api.delete(`/academic/categories/${id}`);
        return response.data;
    },

    // Edit/Delete Subjects
    async updateSubject(id: string, name: string, categoryId: string) {
        const response = await api.put(`/academic/subjects/${id}`, { name, categoryId });
        return response.data;
    },

    async deleteSubject(id: string) {
        const response = await api.delete(`/academic/subjects/${id}`);
        return response.data;
    },

    // Bulk Operations
    async bulkDeleteCategories(ids: string[]) {
        const response = await api.post('/academic/categories/bulk-delete', { ids });
        return response.data;
    },

    async bulkDeleteSubjects(ids: string[]) {
        const response = await api.post('/academic/subjects/bulk-delete', { ids });
        return response.data;
    },

    // 2. Managing Teacher Requests
    async createRequest(data: { type: 'CATEGORY' | 'SUBJECT'; name: string; description?: string; categoryId?: string }) {
        const response = await api.post('/academic/requests', data);
        return response.data;
    },

    async getRequests(status?: string): Promise<AcademicRequest[]> {
        const params = status ? { status } : {};
        const response = await api.get('/academic/requests', { params });
        return response.data;
    },

    // Resolve Request (Approve/Reject)
    async resolveRequest(id: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
        const response = await api.patch(`/academic/requests/${id}`, { status, reason });
        return response.data;
    }
};
