import Link from 'next/link';
import styles from './CTASection.module.css';
import { Rocket, TrendingUp, ShieldCheck, Globe } from 'lucide-react';

export default function CTASection() {
    return (
        <section className={styles.section}>
            <div className={styles.glow}></div>
            <div className={styles.glow2}></div>
            <div className="container">
                <div className={styles.contentWrapper}>
                    <div className={styles.textContent}>
                        <h2 className={styles.title}>
                            Ready to <span style={{ color: '#5A54D4' }}>Transform</span> Education?
                        </h2>
                        <p className={styles.subtitle}>
                            Join our streamlined instructor program. Sign up, share your expertise, and start teaching in minutes.
                            Our new unified onboarding makes it easier than ever to get started.
                        </p>
                        <div className={styles.btnGroup}>
                            <Link href="/become-instructor" className={styles.btnPrimary}>
                                <Rocket size={20} style={{ marginRight: '8px', display: 'inline' }} />
                                Start Teaching Now
                            </Link>
                        </div>
                    </div>

                    <div className={styles.visualContent}>
                        <div className={styles.statItem}>
                            <div style={{ background: 'rgba(90, 84, 212, 0.2)', padding: '0.75rem', borderRadius: '12px', color: '#5A54D4' }}>
                                <Globe size={24} />
                            </div>
                            <div>
                                <div className={styles.statValue}>Global</div>
                                <div className={styles.statLabel}>Reach students worldwide</div>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '12px', color: '#3B82F6' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <div className={styles.statValue}>Growth</div>
                                <div className={styles.statLabel}>Build your personal brand</div>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '12px', color: '#10B981' }}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <div className={styles.statValue}>Secure</div>
                                <div className={styles.statLabel}>Reliable payments & platform</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
