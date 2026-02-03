"use client";
import { useState } from 'react';
import { teacherService } from '@/services/teacherService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Check, Rocket, Globe, Milestone, Shield, Award, Loader2 } from 'lucide-react';
import styles from './instructor.module.css';

export default function BecomeInstructorPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
        expertise: '',
        experience: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Use effect to check if user is already a pending instructor
    const { user, isAuthenticated } = require('@/hooks/useAuth').useAuth();
    const router = require('next/navigation').useRouter();

    if (isAuthenticated && user?.role?.name === 'TEACHER' && user?.isActive === false) {
        router.push('/become-instructor/pending');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await teacherService.joinInstructor(formData);
            setSuccess(true);
            toast.success('Your application has been submitted! 🚀');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.pageContainer}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={styles.successMessage}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '2rem', borderRadius: '50%' }}>
                            <Check size={64} />
                        </div>
                    </div>
                    <h2>Application Received</h2>
                    <p>Thank you for your interest in joining Scholarity. Our team will review your credentials and get back to you shortly via email.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Professional ambient background */}
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity }}
                className={styles.floatingShape}
                style={{ width: '600px', height: '600px', background: '#3B82F6', top: '-10%', left: '-10%' }}
            />

            <div className={styles.contentWrapper}>
                <div className={styles.infoSection}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Share Your <span className={styles.highlight}>Expertise</span> with the World.
                    </motion.h1>
                    <p className={styles.description}>
                        Empower students globally by sharing your unique knowledge.
                        Join our elite network of professional instructors today.
                    </p>

                    <div className={styles.benefits}>
                        <div className={styles.benefitItem}>
                            <div className={styles.iconBox}><Globe size={24} /></div>
                            <div className={styles.benefitText}>
                                <h3>Global Reach</h3>
                                <p>Teach students from every corner of the world.</p>
                            </div>
                        </div>
                        <div className={styles.benefitItem}>
                            <div className={styles.iconBox}><Award size={24} /></div>
                            <div className={styles.benefitText}>
                                <h3>Industry Leadership</h3>
                                <p>Build your reputation as a subject matter expert.</p>
                            </div>
                        </div>
                        <div className={styles.benefitItem}>
                            <div className={styles.iconBox}><Shield size={24} /></div>
                            <div className={styles.benefitText}>
                                <h3>Professional Tools</h3>
                                <p>Access cutting-edge educational management tools.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={styles.formSection}
                >
                    <h2>Instructor Application</h2>
                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className={styles.inputControl}
                                placeholder="Enter your full name"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Work Email</label>
                            <input
                                type="email"
                                name="email"
                                className={styles.inputControl}
                                placeholder="name@company.com"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className={styles.inputControl}
                                placeholder="Secure password"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Professional Expertise</label>
                            <input
                                type="text"
                                name="expertise"
                                className={styles.inputControl}
                                placeholder="e.g. Quantitative Finance, React Architecture"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Years of Experience</label>
                            <input
                                type="text"
                                name="experience"
                                className={styles.inputControl}
                                placeholder="e.g. 10+ years in Fintech"
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Professional Summary</label>
                            <textarea
                                name="bio"
                                className={styles.inputControl}
                                placeholder="Tell us about your background and teaching philosophy..."
                                required
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Submit Application <Rocket size={20} /></>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
