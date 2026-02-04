"use client";
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, ExternalLink, AlertTriangle } from 'lucide-react';

interface CourseVideoPlayerProps {
    url: string;
    title?: string;
    thumbnail?: string;
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({ url, title, thumbnail }) => {
    const [hasError, setHasError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setHasError(false);
    }, [url]);

    // Simple check if it *looks* playable by ReactPlayer (YouTube, SoundCloud, Facebook, Vimeo, Twitch, Streamable, Wistia, DailyMotion, Mixcloud, Vidyard, file paths)
    // ReactPlayer usually handles most common formats. If it's a generic webpage, we might want to prevent "playing" it.
    const isLikelyPlayable = (link: string) => {
        if (!link) return false;
        // Common playable extensions
        if (/\.(mp4|ogg|webm|mov|mkv)$/i.test(link)) return true;
        // Common playable domains
        if (link.match(/(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|twitch\.tv|soundcloud\.com|facebook\.com\/watch)/)) return true;
        return true; // Let ReactPlayer try, we handle error
    };

    if (!isMounted) return null; // Prevent hydration mismatch

    if (!url) {
        return (
            <div className="w-full aspect-video bg-gray-100 flex flex-col items-center justify-center rounded-xl text-gray-400 gap-2">
                <Play size={48} />
                <span>No video source</span>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="w-full aspect-video bg-gray-900 flex flex-col items-center justify-center rounded-xl text-white gap-3 p-4 text-center">
                <AlertTriangle size={32} className="text-yellow-500" />
                <div>
                    <h3 className="font-semibold">Unable to play video</h3>
                    <p className="text-sm text-gray-400 mt-1">This source cannot be embedded.</p>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Open in New Tab <ExternalLink size={14} />
                </a>
            </div>
        );
    }

    return (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg group">
            <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                controls={true}
                light={thumbnail || false} // Use thumbnail as preview if available
                playIcon={
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all scale-100 group-hover:scale-110">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Play size={24} className="ml-1 text-black" />
                        </div>
                    </div>
                }
                onError={() => setHasError(true)}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1 }
                    }
                }}
            />
        </div>
    );
};

export default CourseVideoPlayer;
