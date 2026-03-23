import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { SectionHeader } from '../../shared/ui/SectionHeader';

const PRESET_MINUTES = [1, 5, 10, 15];

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function ClassroomTimerModule({ schoolContext }) {
  const defaultClassroomName = schoolContext.visibleClassrooms[0]?.name || 'Current Classroom';
  const [durationSeconds, setDurationSeconds] = useState(5 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    if (remainingSeconds <= 0) {
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  const timerLabel = useMemo(() => formatSeconds(remainingSeconds), [remainingSeconds]);

  const setTimerMinutes = (minutes) => {
    const seconds = minutes * 60;
    setDurationSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
  };

  const adjustMinutes = (deltaMinutes) => {
    const nextSeconds = Math.max(60, durationSeconds + deltaMinutes * 60);
    setDurationSeconds(nextSeconds);
    setRemainingSeconds(nextSeconds);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setRemainingSeconds(durationSeconds);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module"
        title="Classroom Timer"
        description="A lightweight second app inside the host. This proves the platform can hold multiple tools while keeping a shared look and structure."
      />

      <Card className="bg-slate-50">
        <h3 className="text-lg font-bold text-slate-900">Current classroom</h3>
        <p className="mt-2 text-sm text-slate-600">{defaultClassroomName}</p>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Countdown</p>
          <p className="mt-4 text-7xl font-extrabold tracking-tight text-slate-900">{timerLabel}</p>
          <p className="mt-3 text-sm text-slate-600">
            {isRunning ? 'Timer is running' : remainingSeconds === 0 ? 'Time is up' : 'Timer is paused'}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => setIsRunning(true)} variant="primary" disabled={remainingSeconds === 0 || isRunning}>
            Start
          </Button>
          <Button onClick={() => setIsRunning(false)} variant="secondary" disabled={!isRunning}>
            Pause
          </Button>
          <Button onClick={resetTimer} variant="secondary">
            Reset
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-bold text-slate-900">Quick presets</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {PRESET_MINUTES.map((minutes) => (
              <Button key={minutes} onClick={() => setTimerMinutes(minutes)} variant="secondary">
                {minutes} min
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-900">Adjust duration</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => adjustMinutes(-1)} variant="secondary">
              -1 min
            </Button>
            <Button onClick={() => adjustMinutes(1)} variant="secondary">
              +1 min
            </Button>
            <Button onClick={() => adjustMinutes(5)} variant="secondary">
              +5 min
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
