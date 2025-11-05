import { useState, useEffect, useRef, useCallback } from 'react';
import { meditationService } from '@/services/meditation.service';

export interface BreathEvent {
  phase: 'idle' | 'inhaling' | 'exhaling' | 'holding';
  rms: number;
  spectral_centroid: number;
  confidence: number;
  timestamp: string;
  duration_ms?: number;
  breath_number?: number;
  is_consistent?: boolean;
  deviation_from_target?: number;
}

interface UseBreathDetectionOptions {
  sessionId: string;
  userId: string;
  targetBreathDuration: number;
  onBreathEvent?: (event: BreathEvent) => void;
  onCalibrated?: () => void;
  onError?: (error: Error) => void;
}

export const useBreathDetection = ({
  sessionId,
  userId,
  targetBreathDuration,
  onBreathEvent,
  onCalibrated,
  onError,
}: UseBreathDetectionOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [breathCount, setBreathCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathEvent['phase']>('idle');
  const [confidence, setConfidence] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    try {
      const wsUrl = meditationService.getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({
          action: 'start',
          session_id: sessionId,
          user_id: userId,
          target_breath_duration: targetBreathDuration,
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'breath_event':
            const breathEvent: BreathEvent = message.data;
            setCurrentPhase(breathEvent.phase);
            setConfidence(breathEvent.confidence);

            if (breathEvent.breath_number) {
              setBreathCount(breathEvent.breath_number);
              if (breathEvent.breath_number >= 10 && isCalibrating) {
                setIsCalibrating(false);
                onCalibrated?.();
              }
            }
            onBreathEvent?.(breathEvent);
            break;

          case 'error':
            onError?.(new Error(message.message));
            break;
        }
      };

      ws.onerror = () => onError?.(new Error('WebSocket connection error'));
      ws.onclose = () => setIsConnected(false);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [sessionId, userId, targetBreathDuration, onBreathEvent, onCalibrated, onError, isCalibrating]);

  const startAudioCapture = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 44100,
        },
      });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 44100,
      });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const int16Data = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          wsRef.current.send(int16Data.buffer);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      onError?.(new Error('Microphone access denied'));
    }
  }, [onError]);

  const stopAudioCapture = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    streamRef.current = null;
    processorRef.current = null;
    audioContextRef.current = null;
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ action: 'stop' }));
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudioCapture();
      disconnect();
    };
  }, [stopAudioCapture, disconnect]);

  return {
    isConnected,
    isCalibrating,
    breathCount,
    currentPhase,
    confidence,
    connect,
    disconnect,
    startAudioCapture,
    stopAudioCapture,
  };
};
