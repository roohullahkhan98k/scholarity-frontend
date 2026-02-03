"use client";
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false,
    isLoading = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={`${styles.iconWrapper} ${isDanger ? styles.dangerIcon : ''}`}>
                        <AlertTriangle size={20} />
                    </div>
                    <h2>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <p>{message}</p>
                </div>

                <div className={styles.actions}>
                    <button
                        className="btn btn-outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${isDanger ? styles.btnDanger : 'btn-primary'}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
