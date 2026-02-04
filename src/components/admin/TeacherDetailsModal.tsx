import React from 'react';
import { Teacher } from '@/services/teacherService';
import { X, BookOpen, Mail, Award, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';

interface TeacherDetailsModalProps {
    teacher: Teacher;
    onClose: () => void;
}

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({ teacher, onClose }) => {
    if (!teacher) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '600px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                animation: 'modalSlideIn 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f9fafb'
                }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.125rem',
                            fontWeight: 600
                        }}>
                            {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        {teacher.name}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#6b7280',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '2rem' }}>
                    {/* Bio Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#6b7280',
                            marginBottom: '0.75rem'
                        }}>About</h3>
                        <p style={{
                            fontSize: '0.975rem',
                            lineHeight: '1.6',
                            color: '#374151'
                        }}>
                            {teacher.bio || 'No biography available.'}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#eff6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#3b82f6'
                            }}>
                                <Award size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.125rem' }}>Expertise</div>
                                <div style={{ fontWeight: 500, color: '#111827' }}>{teacher.expertise || 'N/A'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#f0fdf4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#10b981'
                            }}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.125rem' }}>Experience</div>
                                <div style={{ fontWeight: 500, color: '#111827' }}>{teacher.experience || 'N/A'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#fff7ed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#f97316'
                            }}>
                                <Star size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.125rem' }}>Rating</div>
                                <div style={{ fontWeight: 500, color: '#111827' }}>{teacher.rating?.toFixed(1) || '0.0'}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#f5f3ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#8b5cf6'
                            }}>
                                <Users size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.125rem' }}>Students</div>
                                <div style={{ fontWeight: 500, color: '#111827' }}>{teacher.totalStudents || 0}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#e0f2fe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0ea5e9'
                            }}>
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.125rem' }}>Courses</div>
                                <div style={{ fontWeight: 500, color: '#111827' }}>{teacher.totalCourses || 0}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div style={{
                        padding: '1rem',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#4b5563',
                        fontSize: '0.875rem'
                    }}>
                        <Mail size={16} />
                        <span>{teacher.email}</span>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '1rem',
                    background: '#f9fafb'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.625rem 1.25rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#374151',
                            background: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Close
                    </button>
                    <Link
                        href={`/admin/teachers/${teacher.id}/courses`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.625rem 1.25rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'white',
                            background: 'var(--primary-color)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <BookOpen size={18} />
                        View Courses
                    </Link>
                </div>
            </div>
            <style jsx>{`
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TeacherDetailsModal;
