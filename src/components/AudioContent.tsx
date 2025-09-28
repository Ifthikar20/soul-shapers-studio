// src/components/AudioContent.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AudioContentProps {
  audio: any;
  showTranscript: boolean;
}

export const AudioContent = ({ audio, showTranscript }: AudioContentProps) => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Audio Info */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {audio.fullDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-center">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Duration</h4>
            <p className="text-muted-foreground">{audio.duration} of guided audio</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Who Benefits</h4>
            <p className="text-muted-foreground">Anyone experiencing stress or anxiety</p>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h4 className="font-medium text-foreground">Benefits</h4>
          <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
            {audio.benefits?.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-wellness mt-1">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transcript */}
      <div>
        {!showTranscript ? (
          <div className="text-center text-muted-foreground/60 py-8">
            <p className="text-sm">Transcript will appear here when audio begins</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Audio Transcript</h3>
            <ScrollArea className="h-48 w-full rounded-lg p-4 bg-wellness-soft/20 border border-wellness-soft/30">
              <div className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                {audio.transcript}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
