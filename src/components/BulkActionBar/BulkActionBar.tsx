"use client";
import React, { ReactNode } from 'react';
import styles from './BulkActionBar.module.css';

export interface BulkAction {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: 'danger' | 'primary' | 'secondary';
}

interface BulkActionBarProps {
    selectedCount: number;
    actions: BulkAction[];
    onCancel: () => void;
}

export default function BulkActionBar({ selectedCount, actions, onCancel }: BulkActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className={styles.bulkActionBar}>
            <div className={styles.selectionCount}>
                {selectedCount} Selected
            </div>

            <div className={styles.actionButtons}>
                {actions.map((action, idx) => (
                    <button
                        key={idx}
                        className={`${styles.actionBtn} ${action.variant === 'danger' ? styles.danger : styles.primary}`}
                        onClick={action.onClick}
                    >
                        {action.icon}
                        {action.label}
                    </button>
                ))}
            </div>

            <button className={styles.cancelSelectionBtn} onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
}
