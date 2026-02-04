"use client";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import CourseCreateWizard from '@/components/courses/CourseCreateWizard';

export default function AdminCourseCreatePage() {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            <CourseCreateWizard returnPath="/admin/dashboard" />
        </ProtectedRoute>
    );
}
