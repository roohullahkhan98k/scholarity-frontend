"use client";
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '../instructor.module.css';

export default function PendingApprovalPage() {
    return (
        <div className={styles.pageContainer}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.successMessage}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '2rem', borderRadius: '50%' }}>
                        <Clock size={64} className="animate-pulse" />
                    </div>
                </div>
                <h2>Application Under Review</h2>
                <p>Your instructor application is currently being reviewed by our administrative team. This process usually takes 24-48 hours.</p>

                <div style={{
                    marginTop: '2.5rem',
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    textAlign: 'left'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <ShieldCheck size={20} style={{ color: '#3B82F6', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0 }}>Verified account security enabled.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Mail size={20} style={{ color: '#3B82F6', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0 }}>You will receive an email once your account is activated.</p>
                    </div>
                </div>

                <Link href="/" className={styles.submitBtn} style={{ marginTop: '2.5rem', textDecoration: 'none' }}>
                    <ArrowLeft size={20} /> Back to Homepage
                </Link>
            </motion.div>
        </div>
    );
}
