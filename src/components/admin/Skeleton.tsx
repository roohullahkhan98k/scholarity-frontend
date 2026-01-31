import styles from './Skeleton.module.css';

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', className = '' }: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height="16px" width={`${60 + Math.random() * 40}%`} />
                ))}
            </div>
            <div className={styles.tableBody}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className={styles.tableRow}>
                        {[1, 2, 3, 4].map((j) => (
                            <div key={j} className={styles.tableCell}>
                                <Skeleton height="14px" width={`${50 + Math.random() * 40}%`} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className={styles.statCard}>
            <Skeleton width="56px" height="56px" borderRadius="var(--radius-md)" />
            <div className={styles.statContent}>
                <Skeleton width="60px" height="32px" />
                <Skeleton width="100px" height="14px" />
            </div>
        </div>
    );
}

export function StatsGridSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className={styles.statsGrid}>
            {Array.from({ length: count }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    );
}
