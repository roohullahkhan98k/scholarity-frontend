"use client";
import React, { useState, useEffect } from 'react';

/**
 * GlobalLoader provides a subtle progress bar/spinner at the top right
 * to indicate asynchronous actions like saving, deleting, etc.
 */
export const GlobalLoader = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleStop = () => setLoading(false);

        window.addEventListener('global-loading-start', handleStart);
        window.addEventListener('global-loading-stop', handleStop);

        return () => {
            window.removeEventListener('global-loading-start', handleStart);
            window.removeEventListener('global-loading-stop', handleStop);
        };
    }, []);

    if (!loading) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="spinner-sm" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Processing...</span>
            <style jsx>{`
                .spinner-sm {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export const startGlobalLoader = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('global-loading-start'));
    }
};

export const stopGlobalLoader = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('global-loading-stop'));
    }
};
