/**
 * Constructs a full URL for a file resource.
 * Strips '/api' from the base URL if present for direct asset access.
 */
export const getFileUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    // If it's already a full URL or a relative path that doesn't start with /uploads or similar, return as is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    // Remove /api from the end if it exists
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.replace(/\/api$/, '') : apiUrl;

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};
