import { useEffect, useState } from 'react';

const apiKey = '';

export const askGemini = async (prompt) => {
  if (!apiKey) {
    console.warn('API Key is missing. Returning fallback data.');
    if (prompt.includes('rewards')) return `[{"name": "VIP Desk", "cost": 50, "icon": "💺"}, {"name": "Show & Tell", "cost": 30, "icon": "🧸"}, {"name": "DJ for a Day", "cost": 100, "icon": "🎧"}]`;
    if (prompt.includes('job')) return 'Line Leader ($15)';
    return 'Keep up the great work saving!';
  }

  const generateWithRetry = async (retries = 3, delay = 1000) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return generateWithRetry(retries - 1, delay * 2);
      }
      throw error;
    }
  };

  return generateWithRetry();
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
export const generateParentCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();
export const generateParentPin = () => Math.floor(1000 + Math.random() * 9000).toString();

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(h, 10), parseInt(m, 10));
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const checkBankStatus = (settings) => {
  if (!settings) return { open: true };

  if (!settings.isOpen) {
    return { open: false, reason: 'Your teacher has manually locked the bank for now.' };
  }

  if (settings.hoursEnabled) {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = settings.startTime.split(':').map(Number);
    const startMins = startH * 60 + startM;

    const [endH, endM] = settings.endTime.split(':').map(Number);
    const endMins = endH * 60 + endM;

    if (currentMins < startMins || currentMins > endMins) {
      return {
        open: false,
        reason: `School bank hours are from ${formatTime(settings.startTime)} to ${formatTime(settings.endTime)}.`
      };
    }
  }

  return { open: true };
};

export const useScript = (url) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${url}"]`);

    if (existingScript) {
      if (existingScript.dataset.loaded) {
        setLoaded(true);
      } else {
        existingScript.addEventListener('load', () => setLoaded(true));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      setLoaded(true);
    });
    document.body.appendChild(script);
  }, [url]);

  return loaded;
};
