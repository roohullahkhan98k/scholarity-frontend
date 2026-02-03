"use client";
import styles from './FeaturedCourses.module.css';
import CourseCard from '@/components/CourseCard/CourseCard';
import { featuredCourses } from '@/data/courses';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedCourses() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Most Popular Courses</h2>
                    <p className={styles.subtitle}>
                        Explore our highest-rated courses, crafted by industry experts to help you advance your career.
                    </p>
                </div>

                <div className={styles.sliderContainer}>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                        }}
                        style={{ paddingBottom: '3rem' }}
                    >
                        {featuredCourses.map((course) => (
                            <SwiperSlide key={course.id}>
                                <CourseCard course={course} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
