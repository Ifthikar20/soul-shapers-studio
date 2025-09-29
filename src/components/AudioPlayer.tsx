// src/components/AudioPlayer.tsx - FIXED with actual audio playback
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
    audio: any;
    onPlay?: () => void;
    onPause?: () => void;
    onProgressChange?: (progress: number) => void;
}

export const AudioPlayer = ({ audio, onPlay, onPause, onProgressChange }: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState([0]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

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
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress([0]);
            onPause?.();
        };

        audioElement.addEventListener('timeupdate', updateTime);
        audioElement.addEventListener('loadedmetadata', updateDuration);
        audioElement.addEventListener('ended', handleEnded);

        return () => {
            audioElement.removeEventListener('timeupdate', updateTime);
            audioElement.removeEventListener('loadedmetadata', updateDuration);
            audioElement.removeEventListener('ended', handleEnded);
        };
    }, [onPause]);

    const handleTogglePlay = () => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        if (isPlaying) {
            audioElement.pause();
            setIsPlaying(false);
            onPause?.();
        } else {
            audioElement.play();
            setIsPlaying(true);
            onPlay?.();
        }
    };

    const handleProgressChange = (value: number[]) => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        setProgress(value);
        const newTime = (value[0] / 100) * audioElement.duration;
        audioElement.currentTime = newTime;
        onProgressChange?.(value[0]);
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
            />

            {/* Plant Image */}
            <div className="flex justify-center lg:justify-end">
                <div className="relative">
                    <img
                        src={audio.thumbnail}
                        alt="Calming green plant for breathing exercises"
                        className="w-200 h-200 object-contain transition-transform duration-500 hover:scale-105 opacity-95"
                    />
                </div>
            </div>

            {/* Player Controls */}
            <div className="space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-2xl font-semibold text-foreground">
                        {audio.title}
                    </h1>
                    <p className="text-muted-foreground">{audio.description}</p>
                </div>

                <div className="flex flex-col items-center space-y-6">
                    {/* Play/Pause Button */}
                    <Button
                        onClick={handleTogglePlay}
                        size="lg"
                        className="w-20 h-20 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                        {isPlaying ? (
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