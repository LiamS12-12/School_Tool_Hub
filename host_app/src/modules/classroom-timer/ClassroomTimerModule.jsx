import React, { useEffect, useMemo, useState } from 'react';

const PRESET_MINUTES = [1, 5, 10, 15];

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function ClassroomTimerModule({ schoolContext, theme }) {
  const defaultClassroomName =
    schoolContext.visibleClassrooms[0]?.name || 'Current Classroom';

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

  const buttonStyle = (primary = false, disabled = false) => ({
    padding: '12px 16px',
    borderRadius: '14px',
    border: primary ? '1px solid #0ea5e9' : `1px solid ${theme.border}`,
    background: disabled
      ? theme.panelBg
      : primary
        ? '#0ea5e9'
        : theme.panelBg,
    color: disabled ? theme.mutedText : primary ? '#ffffff' : theme.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700,
    fontSize: '14px',
    opacity: disabled ? 0.6 : 1,
  });

  const panelStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: '24px',
    padding: '24px',
  };

  return (
    <div style={{ display: 'grid', gap: '24px', padding: '8px' }}>
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '24px',
          padding: '28px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: theme.mutedText,
          }}
        >
          Module
        </p>
        <h1
          style={{
            margin: '8px 0 10px 0',
            fontSize: '32px',
            color: theme.text,
          }}
        >
          Classroom Timer
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: theme.mutedText,
            maxWidth: '760px',
          }}
        >
          A lightweight second app inside the host. This proves the platform can
          hold multiple tools while keeping a shared look and structure.
        </p>
      </div>

      <div style={panelStyle}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.text }}>
          Current classroom
        </h3>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: theme.mutedText }}>
          {defaultClassroomName}
        </p>
      </div>

      <div style={panelStyle}>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: theme.mutedText,
            }}
          >
            Countdown
          </p>
          <p
            style={{
              margin: '16px 0 0 0',
              fontSize: '72px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: theme.text,
            }}
          >
            {timerLabel}
          </p>
          <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: theme.mutedText }}>
            {isRunning
              ? 'Timer is running'
              : remainingSeconds === 0
                ? 'Time is up'
                : 'Timer is paused'}
          </p>
        </div>

        <div
          style={{
            marginTop: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setIsRunning(true)}
            disabled={remainingSeconds === 0 || isRunning}
            style={buttonStyle(true, remainingSeconds === 0 || isRunning)}
          >
            Start
          </button>
          <button
            onClick={() => setIsRunning(false)}
            disabled={!isRunning}
            style={buttonStyle(false, !isRunning)}
          >
            Pause
          </button>
          <button onClick={resetTimer} style={buttonStyle(false, false)}>
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        <div style={panelStyle}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.text }}>
            Quick presets
          </h3>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {PRESET_MINUTES.map((minutes) => (
              <button
                key={minutes}
                onClick={() => setTimerMinutes(minutes)}
                style={buttonStyle(false, false)}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>

        <div style={panelStyle}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.text }}>
            Adjust duration
          </h3>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <button onClick={() => adjustMinutes(-1)} style={buttonStyle(false, false)}>
              -1 min
            </button>
            <button onClick={() => adjustMinutes(1)} style={buttonStyle(false, false)}>
              +1 min
            </button>
            <button onClick={() => adjustMinutes(5)} style={buttonStyle(false, false)}>
              +5 min
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}