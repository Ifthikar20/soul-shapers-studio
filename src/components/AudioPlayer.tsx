// src/components/AudioPlayer.tsx - Updated with position tracking
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
    audio: any;
    onPlay?: () => void;
    onPause?: (currentTime: number) => void; // ✅ Now accepts position
    onSeek?: (fromPosition: number, toPosition: number) => void; // ✅ New callback
    onComplete?: () => void; // ✅ New callback
    onError?: (errorCode: string, errorMessage: string) => void; // ✅ New callback
    onProgressChange?: (progress: number) => void;
}

export const AudioPlayer = ({ 
    audio, 
    onPlay, 
    onPause, 
    onSeek,
    onComplete,
    onError,
    onProgressChange 
}: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState([0]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const lastSeekPosition = useRef<number>(0); // Track last position for seek events

    // Get audio URL from API or fallback to local
    const audioUrl = audio.audioUrl || '/assets/box-breathing.mp3';

    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        const updateTime = () => {
            setCurrentTime(audioElement.currentTime);
            const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
            setProgress([progressPercent]);
        };

        const updateDuration = () => {
            setDuration(audioElement.duration);
            setIsLoading(false);
            setLoadError(null);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress([0]);
            onPause?.(audioElement.currentTime); // ✅ Send position on pause
            onComplete?.(); // ✅ Trigger complete callback
        };

        const handleError = (e: Event) => {
            const error = (e.target as HTMLAudioElement).error;
            const errorMessage = error ? `Audio error: ${error.message}` : 'Failed to load audio';
            const errorCode = error ? `MEDIA_ERR_${error.code}` : 'UNKNOWN';
            
            setLoadError(errorMessage);
            setIsLoading(false);
            setIsPlaying(false);
            
            console.error('Audio playback error:', errorMessage);
            onError?.(errorCode, errorMessage); // ✅ Trigger error callback
        };

        const handleCanPlay = () => {
            setIsLoading(false);
            setLoadError(null);
        };

        const handleWaiting = () => {
            setIsLoading(true);
        };

        const handlePlaying = () => {
            setIsLoading(false);
        };

        audioElement.addEventListener('timeupdate', updateTime);
        audioElement.addEventListener('loadedmetadata', updateDuration);
        audioElement.addEventListener('ended', handleEnded);
        audioElement.addEventListener('error', handleError);
        audioElement.addEventListener('canplay', handleCanPlay);
        audioElement.addEventListener('waiting', handleWaiting);
        audioElement.addEventListener('playing', handlePlaying);

        return () => {
            audioElement.removeEventListener('timeupdate', updateTime);
            audioElement.removeEventListener('loadedmetadata', updateDuration);
            audioElement.removeEventListener('ended', handleEnded);
            audioElement.removeEventListener('error', handleError);
            audioElement.removeEventListener('canplay', handleCanPlay);
            audioElement.removeEventListener('waiting', handleWaiting);
            audioElement.removeEventListener('playing', handlePlaying);
        };
    }, [onPause, onComplete, onError]);

    // ✅ Reload audio when URL changes
    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        setIsLoading(true);
        setLoadError(null);
        audioElement.load();
    }, [audioUrl]);

    const handleTogglePlay = async () => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        try {
            if (isPlaying) {
                audioElement.pause();
                setIsPlaying(false);
                onPause?.(audioElement.currentTime); // ✅ Send current position
            } else {
                await audioElement.play();
                setIsPlaying(true);
                onPlay?.();
            }
        } catch (error) {
            console.error('Playback error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Playback failed';
            onError?.('PLAYBACK_ERROR', errorMessage);
        }
    };

    const handleProgressChange = (value: number[]) => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        const fromPosition = lastSeekPosition.current; // ✅ Track where we seeked from
        
        setProgress(value);
        const newTime = (value[0] / 100) * audioElement.duration;
        audioElement.currentTime = newTime;
        
        lastSeekPosition.current = newTime; // ✅ Update last position
        
        onProgressChange?.(value[0]);
        onSeek?.(fromPosition, newTime); // ✅ Trigger seek callback
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Hidden audio element */}
            <audio 
                ref={audioRef} 
                src={audioUrl}
                preload="metadata"
            >
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Plant Image */}
            <div className="flex justify-center lg:justify-end">
                <div className="relative">
                    <img
                        src={audio.thumbnail}
                        alt="Calming green plant for breathing exercises"
                        className="w-200 h-200 object-contain transition-transform duration-500 hover:scale-105 opacity-95"
                    />
                    
                    {/* ✅ Loading indicator */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Player Controls */}
            <div className="space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-2xl font-semibold text-foreground">
                        {audio.title}
                    </h1>
                    <p className="text-muted-foreground">{audio.description}</p>
                    
                    {/* ✅ Error message */}
                    {loadError && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {loadError}
                        </p>
                    )}
                    
                    {/* ✅ Security badge (if secure stream) */}
                    {audio.isSecure && (
                        <div className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Secure Stream</span>
                            {audio.cdnEnabled && <span>• CDN</span>}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center space-y-6">
                    {/* Play/Pause Button */}
                    <Button
                        onClick={handleTogglePlay}
                        size="lg"
                        disabled={isLoading || !!loadError}
                        className="w-20 h-20 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : isPlaying ? (
                            <Pause className="w-8 h-8" />
                        ) : (
                            <Play className="w-8 h-8 ml-1" />
                        )}
                    </Button>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md space-y-3">
                        <Slider
                            value={progress}
                            onValueChange={handleProgressChange}
                            max={100}
                            step={1}
                            disabled={isLoading || !!loadError}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};