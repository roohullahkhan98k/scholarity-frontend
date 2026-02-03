"use client";
import React from 'react';
import styles from './LoadingButton.module.css';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    variant?: 'primary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
}

export default function LoadingButton({
    children,
    isLoading = false,
    loadingText,
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    disabled,
    ...props
}: LoadingButtonProps) {
    const variantClass = styles[variant] || styles.primary;
    const sizeClass = styles[size] || styles.md;

    return (
        <button
            className={`${styles.button} ${variantClass} ${sizeClass} ${isLoading ? styles.loading : ''} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <div className={styles.loaderContent}>
                    <div className={styles.spinner}></div>
                    <span>{loadingText || children}</span>
                </div>
            ) : (
                <div className={styles.content}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <span>{children}</span>
                </div>
            )}
        </button>
    );
}
