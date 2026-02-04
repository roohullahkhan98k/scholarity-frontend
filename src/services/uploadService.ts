import api from '@/lib/api';

export const uploadService = {
    // 3.1 Upload Video (POST /api/upload/video)
    async uploadVideo(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // 3.2 Upload PDF/Document (POST /api/upload/pdf)
    async uploadPDF(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // 3.3 Upload Image (POST /api/upload/image)
    async uploadImage(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
