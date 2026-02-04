import React, { useState } from 'react';
import { FileText, Link as LinkIcon, Download, Play, BookOpen, Trash2, ExternalLink, MonitorPlay } from 'lucide-react';
import { getFileUrl } from '@/lib/utils';
import CourseVideoPlayer, { isLikelyVideo } from '@/components/CourseVideoPlayer';
import styles from './ResourceItem.module.css';

interface ResourceItemProps {
    resource: {
        title: string;
        url: string;
        type: string;
    };
    onWatch?: (url: string) => void;
    compact?: boolean;
    thumbnail?: string;
    onDelete?: () => void;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource, compact, thumbnail, onDelete, onWatch }) => {
    const [showInlinePlayer, setShowInlinePlayer] = useState(false);

    const isVideo = isLikelyVideo(resource.url) || resource.type === 'VIDEO';
    const isDownloadable = ['PDF', 'NOTE', 'SYLLABUS'].includes(resource.type) || resource.url?.toLowerCase().endsWith('.pdf');
    const videoUrl = resource.url;

    const getIcon = () => {
        if (isVideo) return <MonitorPlay size={18} className={styles.videoIcon} />;
        if (isDownloadable) return <FileText size={18} className={styles.docIcon} />;
        if (resource.type === 'SYLLABUS') return <BookOpen size={18} className={styles.syllabusIcon} />;
        return <LinkIcon size={18} className={styles.linkIcon} />;
    };

    // Video Card Mode (Main content area)
    if (isVideo && !compact) {
        return (
            <div className={styles.videoCardWrapper}>
                <div className={styles.videoCard}>
                    <div className={styles.videoPreview}>
                        <CourseVideoPlayer
                            url={videoUrl}
                            thumbnail={thumbnail}
                            title={resource.title}
                        />
                    </div>
                    <div className={styles.videoDetails}>
                        <div className={styles.videoHeader}>
                            <div className={styles.videoInfo}>
                                <span className={styles.videoTitle}>{resource.title}</span>
                                <div className={styles.videoMetaTags}>
                                    <span className={styles.typeTag}>{resource.type}</span>
                                    <span className={styles.inPlatformBadge}>Optimized Playback</span>
                                </div>
                            </div>
                            <div className={styles.videoActions}>
                                <a
                                    href={getFileUrl(videoUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionBtn}
                                    title="Open link in new tab"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                {onDelete && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                        className={`${styles.actionBtn} ${styles.deleteColor}`}
                                        title="Remove resource"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // List/Compact Mode (Sidebar, modal, or simple file lists)
    return (
        <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
            <div className={styles.itemMain}>
                <div className={styles.leftInfo}>
                    <div className={styles.iconWrapper}>
                        {getIcon()}
                    </div>
                    <div className={styles.details}>
                        <span className={styles.title}>{resource.title}</span>
                        {!compact && <span className={styles.typeLabel}>{resource.type}</span>}
                    </div>
                </div>

                <div className={styles.actions}>
                    {isVideo ? (
                        <button
                            onClick={() => {
                                if (onWatch) onWatch(videoUrl);
                                else setShowInlinePlayer(!showInlinePlayer);
                            }}
                            className={styles.watchBtn}
                        >
                            <Play size={14} fill="currentColor" /> {showInlinePlayer ? 'Close' : 'Watch'}
                        </button>
                    ) : (
                        <>
                            <a
                                href={getFileUrl(resource.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.viewBtn}
                            >
                                {compact ? <ExternalLink size={14} /> : 'View'}
                            </a>
                            {isDownloadable && (
                                <a
                                    href={getFileUrl(resource.url)}
                                    download
                                    className={styles.downloadBtn}
                                    title="Download file"
                                >
                                    <Download size={14} />
                                </a>
                            )}
                        </>
                    )}
                    {onDelete && (
                        <button onClick={onDelete} className={styles.deleteBtn} title="Remove resource">
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {showInlinePlayer && (
                <div className={styles.inlinePlayerWrapper}>
                    <CourseVideoPlayer
                        url={videoUrl}
                        thumbnail={thumbnail}
                        title={resource.title}
                        autoPlay={true}
                    />
                </div>
            )}
        </div>
    );
};

export default ResourceItem;
