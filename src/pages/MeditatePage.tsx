import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useBreathDetection, BreathEvent } from '@/hooks/useBreathDetection';
import { meditationService } from '@/services/meditation.service';
import { Play, Pause, StopCircle, Activity, Wind, TrendingUp, Loader2 } from 'lucide-react';

const MeditatePage: React.FC = () => {
  const { user } = useAuth();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [latestBreathEvent, setLatestBreathEvent] = useState<BreathEvent | null>(null);
  const [consistency, setConsistency] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const breathDetection = useBreathDetection({
    sessionId: sessionId || '',
    userId: user?.id || '',
    targetBreathDuration: 4,
    onBreathEvent: (event) => {
      setLatestBreathEvent(event);
      if (event.is_consistent !== undefined) {
        setConsistency(event.is_consistent);
      }
    },
    onCalibrated: () => console.log('Calibration complete!'),
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime]);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const session = await meditationService.startSession('free_practice', 4);
      setSessionId(session.session_id);
      setStartTime(Date.now());
      setIsActive(true);

      await breathDetection.connect();
      await breathDetection.startAudioCapture();

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to start meditation');
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      if (!sessionId) return;

      breathDetection.stopAudioCapture();
      breathDetection.disconnect();

      await meditationService.completeSession(
        sessionId,
        elapsedTime,
        breathDetection.breathCount
      );

      setIsActive(false);
      setSessionId(null);
      setElapsedTime(0);
      setLatestBreathEvent(null);
    } catch (err: any) {
      setError(err.message || 'Failed to stop meditation');
    }
  };

  const handlePause = () => setIsPaused(!isPaused);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathCircleStyle = () => {
    if (!isActive || !latestBreathEvent) {
      return { scale: 0.5, color: 'bg-gray-300 dark:bg-gray-700', text: 'Ready' };
    }

    switch (latestBreathEvent.phase) {
      case 'inhaling':
        return { scale: 1.0, color: 'bg-blue-400', text: 'Breathe In' };
      case 'exhaling':
        return { scale: 0.5, color: 'bg-green-400', text: 'Breathe Out' };
      case 'holding':
        return { scale: 1.0, color: 'bg-purple-400', text: 'Hold' };
      default:
        return { scale: 0.5, color: 'bg-gray-300 dark:bg-gray-700', text: 'Idle' };
    }
  };

  const circleStyle = getBreathCircleStyle();

  return (
    <>
      <Header />
      <PageLayout hasHero={false}>
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Live Meditation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time breath guidance for mindful meditation
            </p>
          </div>

          {error && (
            <Card className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </Card>
          )}

          {isActive && breathDetection.isCalibrating && (
            <Card className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 text-center">
                🎯 Calibrating... Breathe naturally for the first 10 breaths
              </p>
            </Card>
          )}

          <div className="flex justify-center mb-12">
            <div className="relative w-64 h-64">
              <div
                className={`absolute inset-0 rounded-full ${circleStyle.color} transition-all duration-1000 ease-in-out flex items-center justify-center shadow-lg`}
                style={{
                  transform: `scale(${circleStyle.scale})`,
                  opacity: isActive ? 0.8 : 0.3,
                }}
              >
                <span className="text-white text-2xl font-semibold">
                  {circleStyle.text}
                </span>
              </div>

              {isActive && latestBreathEvent?.phase === 'inhaling' && (
                <div className="absolute inset-0 rounded-full bg-blue-300 animate-ping opacity-20" />
              )}
            </div>
          </div>

          {isActive && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <Wind className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {breathDetection.breathCount}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Breaths</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <Activity className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Time</div>
              </Card>

              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {Math.round(breathDetection.confidence * 100)}%
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Confidence</div>
              </Card>
            </div>
          )}

          {isActive && !breathDetection.isCalibrating && consistency !== null && (
            <Card
              className={`p-4 mb-8 text-center ${
                consistency
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              }`}
            >
              <p className={consistency ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'}>
                {consistency ? '✨ Great! Your breathing is consistent' : '🎯 Try to maintain a steady rhythm'}
              </p>
            </Card>
          )}

          <div className="flex justify-center gap-4">
            {!isActive ? (
              <Button
                size="lg"
                onClick={handleStart}
                disabled={isLoading}
                className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    Start Meditation
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button size="lg" variant="outline" onClick={handlePause} className="px-6 py-6">
                  <Pause className="w-5 h-5 mr-2" />
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>

                <Button size="lg" variant="destructive" onClick={handleStop} className="px-6 py-6">
                  <StopCircle className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default MeditatePage;
