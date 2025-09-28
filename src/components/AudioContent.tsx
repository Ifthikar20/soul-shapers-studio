// src/components/AudioContent.tsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AudioContentProps {
  audio: any;
  showTranscript: boolean;
}

export const AudioContent = ({ audio, showTranscript }: AudioContentProps) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Audio Info */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
            {audio.fullDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-center">
        </div>

      
      </div>

      {/* Transcript */}
      <div>
        {!showTranscript ? (
          <div className="text-center text-muted-foreground/60 py-4">
            <p className="text-sm">Transcript will appear here when audio begins</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">Audio Transcript</h3>
            <ScrollArea className="h-48 w-full rounded-lg p-4 bg-gray-50 border border-gray-200">
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