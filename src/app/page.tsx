import styles from './page.module.css';
import Hero from '@/components/Hero/Hero';
import StatsSection from '@/components/StatsSection/StatsSection';
import CategoriesSection from '@/components/CategoriesSection/CategoriesSection';
import FeaturedCourses from '@/components/FeaturedCourses/FeaturedCourses';
import TeacherCard from '@/components/TeacherCard/TeacherCard';
import ReviewCard from '@/components/ReviewCard/ReviewCard';
import CTASection from '@/components/CTASection/CTASection';
import { teachers } from '@/data/teachers';
import { reviews } from '@/data/reviews';

export default function Home() {
  return (
    <>
      <Hero />

      <StatsSection />

      <CategoriesSection />

      <FeaturedCourses />

      {/* Featured Teachers Section */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.title}>Featured Instructors</h2>
            <p className={styles.subtitle}>
              Learn from industry experts and passionate educators committed to your success.
            </p>
          </div>

          <div className={styles.grid}>
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={`${styles.section} ${styles.bgAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.title}>Student Success Stories</h2>
            <p className={styles.subtitle}>
              See how Scholarity is transforming lives through personalized learning.
            </p>
          </div>

          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
