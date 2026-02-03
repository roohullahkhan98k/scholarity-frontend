"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { RoleName } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: RoleName | RoleName[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            if (requiredRole) {
                const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
                const userRoleName = user?.role?.name?.toUpperCase();
                const hasRequiredRole = !!userRoleName && roles.some(role => role.toUpperCase() === userRoleName);

                if (!hasRequiredRole) {
                    // Redirect to appropriate dashboard based on user's actual role
                    const currentRole = user?.role?.name;
                    if (currentRole === 'SUPER_ADMIN') {
                        router.push('/admin/dashboard');
                    } else if (currentRole === 'TEACHER') {
                        router.push('/teacher/dashboard');
                    } else {
                        router.push('/dashboard');
                    }
                }
            }
        }
    }, [isAuthenticated, user, loading, requiredRole, router]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    const roles = requiredRole ? (Array.isArray(requiredRole) ? requiredRole : [requiredRole]) : [];
    const userRoleName = user?.role?.name?.toUpperCase();
    const hasRequiredRole = !requiredRole || (!!userRoleName && roles.some(role => role.toUpperCase() === userRoleName));

    if (!isAuthenticated || !hasRequiredRole) {
        return null;
    }

    return <>{children}</>;
}
