"use client";
import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { getFileUrl } from '@/lib/utils';

interface CourseVideoPlayerProps {
    url: string;
    title?: string;
    thumbnail?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

/**
 * Enhanced utility to detect video content and generate clean embed URLs.
 * Includes parameters to hide suggested videos (YouTube) and optimize for production.
 */
export const getEmbedInfo = (url: string, options?: { autoPlay?: boolean; loop?: boolean; muted?: boolean }) => {
    if (!url) return { type: 'none', embedUrl: '' };

    const { autoPlay, loop, muted } = options || {};

    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) {
        const videoId = ytMatch[1];
        const params: any = {
            rel: '0',
            modestbranding: '1',
            autoplay: autoPlay ? '1' : '0',
            mute: muted ? '1' : '0',
            origin: typeof window !== 'undefined' ? window.location.origin : undefined
        };

        // Filter out undefined values
        const cleanParams: any = {};
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined) cleanParams[key] = params[key];
        });

        const queryString = new URLSearchParams(cleanParams).toString();
        return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}?${queryString}` };
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
    if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        const params: any = {
            autoplay: autoPlay ? '1' : '0',
            loop: loop ? '1' : '0',
            muted: muted ? '1' : '0',
            badge: '0',
            autopause: '0'
        };
        const queryString = new URLSearchParams(params).toString();
        return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${videoId}?${queryString}` };
    }

    // Direct Video File
    if (/\.(mp4|ogg|webm|mov|mkv)$/i.test(url)) return { type: 'file', embedUrl: getFileUrl(url) };

    return { type: 'unknown', embedUrl: url };
};

export const isLikelyVideo = (url: string) => {
    const info = getEmbedInfo(url);
    return info.type !== 'none' && info.type !== 'unknown';
};

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({
    url,
    title,
    thumbnail,
    autoPlay = false,
    loop = false,
    muted = false
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const info = getEmbedInfo(url, { autoPlay, loop, muted });
    const fullUrl = info.embedUrl;

    useEffect(() => {
        setIsMounted(true);
        setIsLoading(true);
        setHasError(false);
    }, [url]);

    if (!isMounted) return <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8fafc', borderRadius: '12px' }} />;

    if (!url || info.type === 'none') {
        return (
            <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                border: '1px dashed #e2e8f0',
                color: '#94a3b8',
                gap: '12px'
            }}>
                <div style={{ background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Play size={24} color="#3b82f6" />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>No project video provided</span>
            </div>
        );
    }

    const playerStyles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'block',
        border: 'none',
        borderRadius: '12px'
    };

    const renderPlayer = () => {
        if (info.type === 'youtube' || info.type === 'vimeo') {
            return (
                <iframe
                    src={fullUrl}
                    style={playerStyles}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                    title={title || "Video Player"}
                />
            );
        }

        if (info.type === 'file') {
            return (
                <video
                    src={fullUrl}
                    controls
                    autoPlay={autoPlay}
                    loop={loop}
                    muted={muted}
                    style={{ ...playerStyles, objectFit: 'contain', background: '#000' }}
                    poster={thumbnail ? getFileUrl(thumbnail) : undefined}
                    onLoadedData={() => setIsLoading(false)}
                    onError={() => setHasError(true)}
                >
                    Your browser does not support the video tag.
                </video>
            );
        }

        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                padding: '32px',
                textAlign: 'center',
                color: 'white',
                borderRadius: '12px'
            }}>
                <AlertTriangle size={36} color="#f59e0b" style={{ marginBottom: '16px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Embed Blocked</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px', maxWidth: '300px' }}>
                    This resource provider might prevent in-platform embedding.
                </p>
                <a
                    href={getFileUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Watch Externally <ExternalLink size={14} />
                </a>
            </div>
        );
    };

    return (
        <div className="player-outer-container" style={{
            width: '100%',
            position: 'relative',
            aspectRatio: '16/9',
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
            zIndex: 1
        }}>
            {isLoading && info.type !== 'unknown' && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0f1e',
                    zIndex: 10,
                    gap: '12px'
                }}>
                    <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                    <span style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.1em', fontWeight: 800 }}>INITIALIZING</span>
                </div>
            )}

            {hasError ? (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                    padding: '32px',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <AlertTriangle size={32} color="#ef4444" style={{ marginBottom: '16px' }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Network Error: File unreachable</p>
                    <a
                        href={getFileUrl(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: '#1e293b',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            border: '1px solid #334155'
                        }}
                    >
                        Try Direct URL
                    </a>
                </div>
            ) : renderPlayer()}

            <style jsx>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CourseVideoPlayer;
