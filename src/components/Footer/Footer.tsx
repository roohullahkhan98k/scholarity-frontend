import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.brand}>
                    <h2 className={styles.logo}>Scholarity</h2>
                    <p className={styles.tagline}>Empowering global learning.</p>
                </div>
                <div className={styles.links}>
                    <div>
                        <h4>Platform</h4>
                        <ul>
                            <li>Browse Tutors</li>
                            <li>How it Works</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Company</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Careers</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Scholarity. All rights reserved.
            </div>
        </footer>
    );
}
