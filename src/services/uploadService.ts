import api from '@/lib/api';

export const uploadService = {
    /**
     * Upload a video file
     * @param file The file to upload
     * @returns Promise with the file URL
     */
    async uploadVideo(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    },

    /**
     * Upload a PDF/Document file
     * @param file The file to upload
     * @returns Promise with the file URL
     */
    async uploadPDF(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload/pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    },

    /**
     * Get the full URL for a file served from the uploads directory
     * @param filename The name of the file
     * @returns Full URL string
     */
    getUploadUrl(filename: string): string {
        if (!filename) return '';
        if (filename.startsWith('http')) return filename;

        // Based on the guide: http://localhost:8000/uploads/[filename]
        // We'll use the API URL but target the uploads path
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
        return `${baseUrl}/uploads/${filename}`;
    }
};
