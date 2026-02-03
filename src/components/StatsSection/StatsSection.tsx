"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';
import styles from './StatsSection.module.css';

const stats = [
    { label: 'Happy Students', value: 15, suffix: ' Million+', color: '#FFF7E6' },
    { label: 'Mock Tests', value: 24000, suffix: '+', color: '#FEF2F2' },
    { label: 'Video Lectures', value: 14000, suffix: '+', color: '#E6FFFA' },
    { label: 'Practice Papers', value: 80000, suffix: '+', color: '#F3F0FF' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        stiffness: 40,
        damping: 20,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} className={styles.number}>0{suffix}</span>;
}

export default function StatsSection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>A Platform Trusted by Students</h2>
                    <p className={styles.subtitle}>
                        Scholarity aims to transform not just through words, but provide results with numbers!
                    </p>
                </div>

                <div className={styles.grid}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={styles.statItem}
                            style={{ backgroundColor: stat.color }}
                        >
                            <Counter value={stat.value} suffix={stat.suffix} />
                            <span className={styles.label}>{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.ctaWrapper}>
                    <button className={styles.getStartedBtn}>
                        Get Started
                    </button>
                </div>
            </div>
        </section>
    );
}
