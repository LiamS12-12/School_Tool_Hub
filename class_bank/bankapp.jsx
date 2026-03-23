import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit3, X, CheckCircle2, Award, 
  TrendingUp, Sparkles, Wand2, Loader2, LogOut, 
  ChevronDown, ChevronUp, Users, Store, DollarSign,
  LayoutGrid, Briefcase, Target, Lock, Printer, QrCode,
  CreditCard, List, ArrowLeft, AlertCircle, ShoppingBag,
  Camera, Settings, Clock, Unlock, Power, Key, User
} from 'lucide-react';

// --- API & Helpers ---
const apiKey = ""; // API key is provided by the execution environment

const askGemini = async (prompt) => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning fallback data.");
    if (prompt.includes("rewards")) return `[{"name": "VIP Desk", "cost": 50, "icon": "👑"}, {"name": "Show & Tell", "cost": 30, "icon": "🧸"}, {"name": "DJ for a Day", "cost": 100, "icon": "🎧"}]`;
    if (prompt.includes("job")) return `Line Leader ($15)`;
    return "Keep up the great work saving!";
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
        await new Promise(res => setTimeout(res, delay));
        return generateWithRetry(retries - 1, delay * 2);
      }
      throw error;
    }
  };

  return await generateWithRetry();
};

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateParentCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();
const generateParentPin = () => Math.floor(1000 + Math.random() * 9000).toString();

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(parseInt(h, 10), parseInt(m, 10));
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Logic to determine if the bank is accessible to students
const checkBankStatus = (settings) => {
  if (!settings) return { open: true };
  
  if (!settings.isOpen) {
    return { open: false, reason: "Your teacher has manually locked the bank for now." };
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

// --- Initial Mock Data ---
const initialDb = {
  teacherAuth: { username: 'teacher', password: 'password123' },
  classes: [{ 
    id: 'class-1', 
    name: 'Mrs. Frizzle\'s 3rd Grade', 
    communityGoal: { name: 'Class Pizza Party', target: 1000 },
    bankSettings: {
      isOpen: true,
      hoursEnabled: false,
      startTime: '08:00',
      endTime: '15:00'
    }
  }],
  students: [
    { id: 's-1', classId: 'class-1', name: 'Arnold', pin: '1234', avatar: '🧑‍🦰', balance: 45, job: 'Plant Monitor', salary: 10, savingsGoal: { name: 'Fossil Kit', target: 100 }, parentCode: 'XYZ-123', parentPin: '5544' },
    { id: 's-2', classId: 'class-1', name: 'Wanda', pin: '5678', avatar: '👧', balance: 120, job: 'Meteorologist', salary: 15, savingsGoal: { name: 'Telescope Time', target: 150 }, parentCode: 'ABC-987', parentPin: '1122' },
    { id: 's-3', classId: 'class-1', name: 'Carlos', pin: '', avatar: '👦', balance: 10, job: 'Comedian', salary: 5, savingsGoal: { name: 'Joke Book', target: 20 }, parentCode: 'LMN-456', parentPin: '9988' },
  ],
  storeItems: [
    { id: 'i-1', classId: 'class-1', name: 'Homework Pass', cost: 50, icon: '🎟️' },
    { id: 'i-2', classId: 'class-1', name: 'Furry Friend on Desk', cost: 30, icon: '🧸' },
    { id: 'i-3', classId: 'class-1', name: 'Choose Your Seat', cost: 100, icon: '🪑' },
    { id: 'i-4', classId: 'class-1', name: '10 Min Free Time', cost: 40, icon: '⏱️' },
    { id: 'i-5', classId: 'class-1', name: 'Listen to Music', cost: 60, icon: '🎧' },
  ],
  transactions: []
};

const avatars = ['👦', '👧', '🧑', '👨', '👩', '👱‍♂️', '👱‍♀️', '🧑‍🦱', '👩‍🦱', '🧑‍🦰', '👩‍🦰', '🦊', '🐱', '🐼', '🐸', '🐵', '🦄', '🦖', '🐙', '🐝'];

// --- Reusable UI Components ---

function ActionModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "danger", icon: Icon }) {
  if (!isOpen) return null;
  
  const colors = {
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200",
    primary: "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200"
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
        {Icon && (
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${type === 'danger' ? 'bg-rose-100 text-rose-500' : type === 'success' ? 'bg-emerald-100 text-emerald-500' : 'bg-sky-100 text-sky-500'}`}>
            <Icon size={32} />
          </div>
        )}
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 mb-6 font-medium">{message}</p>
        <div className="flex gap-3">
          {onCancel && (
            <button onClick={onCancel} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm} className={`flex-1 font-bold py-3 rounded-xl transition-colors shadow-md ${colors[type]}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function RealQrScanner({ onScan, onCancel }) {
  const isLoaded = useScript('https://unpkg.com/html5-qrcode');
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    let html5QrCode;
    let isUnmounted = false;

    const initScanner = async () => {
      await new Promise(res => setTimeout(res, 100));
      html5QrCode = new window.Html5Qrcode("qr-reader");

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (html5QrCode.isScanning) {
              html5QrCode.stop().then(() => onScan(decodedText)).catch(console.error);
            }
          },
          (errorMessage) => {}
        );
        
        if (isUnmounted && html5QrCode.isScanning) {
          html5QrCode.stop();
        }
      } catch (err) {
        if (!isUnmounted) {
          setErrorMsg("Camera access denied or unavailable. Please check your browser permissions.");
        }
      }
    };

    initScanner();

    return () => {
      isUnmounted = true;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isLoaded, onScan]);

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-300">
      {errorMsg ? (
        <div className="text-rose-500 font-bold mb-6 bg-rose-50 p-4 rounded-2xl w-full text-sm flex items-start gap-2 border border-rose-100 text-left">
          <AlertCircle className="shrink-0 mt-0.5" /> 
          <p>{errorMsg}</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Scan your Card</h2>
          <p className="text-slate-500 font-medium mb-6 text-sm">Hold your printed QR code up to the camera.</p>
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden mb-6 border-4 border-slate-100 shadow-inner bg-slate-900 aspect-square flex items-center justify-center">
            {!isLoaded && <div className="text-sky-500 flex flex-col items-center gap-2 font-bold"><Loader2 className="animate-spin" size={32} /> Loading Camera...</div>}
            <div id="qr-reader" className="w-full absolute inset-0"></div>
          </div>
        </>
      )}
      <button onClick={onCancel} className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 rounded-xl transition-colors">
        Cancel Scan
      </button>
    </div>
  );
}

// --- Hooks ---
const useScript = (url) => {
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
      script.dataset.loaded = "true";
      setLoaded(true);
    });
    document.body.appendChild(script);
  }, [url]);
  return loaded;
};

// --- Components ---

function BankClosedScreen({ reason, onBack }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Lock size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-3">Bank is Closed</h1>
        <p className="text-slate-500 font-medium mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
          {reason}
        </p>
        <button onClick={onBack} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
          <ArrowLeft size={20} /> Back to Start
        </button>
      </div>
    </div>
  );
}

function TabSettings({ classData, updateDb }) {
  const settings = classData.bankSettings || initialDb.classes[0].bankSettings;

  const updateSettings = (updates) => {
    updateDb(prev => ({
      ...prev,
      classes: prev.classes.map(c => c.id === classData.id ? {
        ...c,
        bankSettings: { ...c.bankSettings, ...updates }
      } : c)
    }));
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-slate-500" /> Access Controls & Settings
        </h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage when students can log in and access their bank accounts.</p>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Manual Override Section */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Power className={settings.isOpen ? 'text-emerald-500' : 'text-rose-500'} /> 
                Manual Override
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Instantly lock or unlock the bank for all students.</p>
            </div>
            <button 
              onClick={() => updateSettings({ isOpen: !settings.isOpen })}
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-sky-100 ${settings.isOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${settings.isOpen ? 'translate-x-11' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${settings.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {settings.isOpen ? <Unlock size={18} /> : <Lock size={18} />}
            {settings.isOpen ? "The bank is currently OPEN. Students can log in." : "The bank is currently LOCKED. Students cannot log in right now."}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <input 
              type="checkbox" 
              id="hoursEnabled"
              checked={settings.hoursEnabled}
              onChange={(e) => updateSettings({ hoursEnabled: e.target.checked })}
              className="w-6 h-6 rounded-md text-sky-500 border-slate-300 focus:ring-sky-500 accent-sky-500 cursor-pointer"
            />
            <label htmlFor="hoursEnabled" className="text-lg font-bold text-slate-800 cursor-pointer flex items-center gap-2">
              <Clock className="text-sky-500" /> Enable Automatic School Hours
            </label>
          </div>

          <div className={`grid sm:grid-cols-2 gap-6 transition-opacity ${settings.hoursEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Bank Opens At</label>
              <input 
                type="time" 
                value={settings.startTime}
                onChange={(e) => updateSettings({ startTime: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-lg font-bold bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Bank Closes At</label>
              <input 
                type="time" 
                value={settings.endTime}
                onChange={(e) => updateSettings({ endTime: e.target.value })}
                className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-lg font-bold bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          {settings.hoursEnabled && (
             <p className="mt-4 text-sm text-slate-500 font-medium italic">
               * The bank will automatically lock outside of these hours. Manual override will still bypass this schedule.
             </p>
          )}
        </div>
      </div>
    </div>
  );
}

function TeacherStoreManager({ classId, db, updateDb }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const storeItems = db.storeItems.filter(i => i.classId === classId);

  const handleAiRestock = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate 4 fun, creative, non-monetary classroom rewards that elementary students can buy with fake classroom money. Return ONLY a valid JSON array of objects. Schema: [{ "name": "string (e.g. Teacher's Chair)", "cost": number (between 20 and 150), "icon": "string (a single emoji)" }]`;
      
      const responseText = await askGemini(prompt);
      const jsonMatch = responseText.match(/\[.*\]/s);
      const newItems = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      
      if (newItems && Array.isArray(newItems)) {
        const formattedItems = newItems.map(item => ({
          id: generateId(), classId: classId, name: item.name, cost: item.cost, icon: item.icon
        }));
        updateDb(prev => ({ ...prev, storeItems: [...formattedItems, ...prev.storeItems] }));
        setIsOpen(true);
      } else {
        setAlertMsg("Oops! The AI didn't format the items correctly. Try again.");
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      setAlertMsg("Oops! The AI needs a quick recess. Try again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteItem = (itemId) => {
    updateDb(prev => ({ ...prev, storeItems: prev.storeItems.filter(i => i.id !== itemId) }));
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 group-hover:text-sky-600 transition-colors select-none">
            <Store className="text-sky-500" /> Class Store Items
            {isOpen ? <ChevronUp size={20} className="text-slate-400 ml-1" /> : <ChevronDown size={20} className="text-slate-400 ml-1" />}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1 select-none">Click to {isOpen ? 'hide' : 'view'} available items</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleAiRestock(); }} disabled={isGenerating} className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center">
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {isGenerating ? "Generating Ideas..." : "AI Idea Generator"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {storeItems.map(item => (
              <div key={item.id} className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative group hover:border-sky-300 transition-colors">
                <button onClick={() => deleteItem(item.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 w-full leading-tight mb-2">{item.name}</h3>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mt-auto">${item.cost}</div>
              </div>
            ))}
            {storeItems.length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                No items in the store yet. Use the AI Generator to add some!
              </div>
            )}
          </div>
        </div>
      )}

      <ActionModal 
        isOpen={!!alertMsg}
        title="Store Update"
        message={alertMsg}
        onConfirm={() => setAlertMsg("")}
        confirmText="Okay"
        type="primary"
        icon={AlertCircle}
      />
    </div>
  );
}

function AddStudentModal({ classId, onClose, updateDb }) {
  const [name, useState] = React.useState('');
  const [pin, setPin] = React.useState('');
  const [selectedAvatar, setSelectedAvatar] = React.useState(avatars[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    const newStudent = {
      id: generateId(), 
      classId, 
      name, 
      pin, 
      avatar: selectedAvatar,
      balance: 0, 
      job: '', 
      salary: 0, 
      savingsGoal: null,
      parentCode: generateParentCode(),
      parentPin: generateParentPin()
    };
    updateDb(prev => ({ ...prev, students: [...prev.students, newStudent] }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Add New Student</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 sm:mb-2">Student Name</label>
            <input type="text" autoFocus value={name} onChange={e => useState(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-base sm:text-lg font-bold" placeholder="e.g. Maya" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 sm:mb-2">Login PIN <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="text" value={pin} onChange={e => setPin(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-base sm:text-lg font-bold" placeholder="e.g. 1234" />
          </div>
          <div className="flex flex-col flex-1">
            <label className="block text-sm font-bold text-slate-600 mb-1.5 sm:mb-2 shrink-0">Choose Avatar</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto p-2 bg-slate-50 rounded-xl border-2 border-slate-100 max-h-[35vh] sm:max-h-48">
              {avatars.map(a => (
                <button key={a} onClick={() => setSelectedAvatar(a)} className={`text-2xl sm:text-3xl p-2 rounded-xl transition-all flex items-center justify-center ${selectedAvatar === a ? 'bg-sky-100 scale-110 shadow-sm' : 'hover:bg-slate-200 opacity-70 hover:opacity-100'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 shrink-0">
          <button onClick={handleAdd} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-base sm:text-lg py-3 sm:py-4 rounded-xl transition-colors shadow-md shadow-sky-200">
            Add to Class
          </button>
        </div>
      </div>
    </div>
  );
}

function PrintOptionsModal({ onClose, onPrint }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Printer className="text-sky-500" /> Print Options
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-200 text-slate-500 hover:bg-slate-300 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <button 
            onClick={() => onPrint('cards')} 
            className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-sky-400 hover:bg-sky-50 transition-all group flex items-start gap-4"
          >
            <div className="bg-sky-100 text-sky-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Student Debit Cards</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Print cut-out cards with real QR codes for students to scan.</p>
            </div>
          </button>
          <button 
            onClick={() => onPrint('list')} 
            className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-purple-400 hover:bg-purple-50 transition-all group flex items-start gap-4"
          >
            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <List size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Teacher Roster List</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Print a list of all students with their PINs, Parent Codes, and Parent PINs.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function PrintView({ type, students, classData, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black absolute inset-0 z-[100] p-8 print:p-0">
      <div className="print:hidden mb-8 flex justify-between items-center bg-slate-100 p-4 rounded-xl">
        <p className="text-slate-600 font-bold flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} /> Preparing document for printing...
        </p>
        <button onClick={onClose} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-700">
          <ArrowLeft size={18} /> Exit Print View
        </button>
      </div>

      {type === 'cards' && (
        <div className="print:m-0 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center print:mb-4">{classData?.name} - Student Cards</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 print:gap-4">
            {students.map(student => {
              const qrData = `https://classbank.app/login/${student.id}`;
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}&margin=0`;

              return (
                <div key={student.id} className="border-4 border-slate-800 rounded-2xl p-6 text-center break-inside-avoid shadow-sm print:shadow-none">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{student.avatar}</div>
                    <div className="bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Debit</div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="border-4 border-slate-200 p-2 rounded-xl inline-block bg-white">
                      <img src={qrImageUrl} alt={`QR Code for ${student.name}`} className="w-20 h-20 object-contain mix-blend-multiply" crossOrigin="anonymous" />
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 truncate mb-1">{student.name}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{classData?.name}</p>
                  {student.pin && (
                     <p className="mt-3 text-sm font-bold bg-slate-100 py-1.5 rounded-lg border border-slate-200">PIN: {student.pin}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {type === 'list' && (
        <div className="print:m-0 max-w-4xl mx-auto">
          <div className="mb-8 text-center print:mb-6">
            <h1 className="text-3xl font-black text-slate-900 mb-2">{classData?.name}</h1>
            <h2 className="text-xl font-bold text-slate-600">Student & Parent Credentials Roster</h2>
          </div>
          <table className="w-full border-collapse border-2 border-slate-800 text-left">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-2 border-slate-800 p-3 font-bold uppercase text-sm tracking-wider">Student Name</th>
                <th className="border-2 border-slate-800 p-3 font-bold uppercase text-sm tracking-wider">Student PIN</th>
                <th className="border-2 border-slate-800 p-3 font-bold uppercase text-sm tracking-wider">Parent Code</th>
                <th className="border-2 border-slate-800 p-3 font-bold uppercase text-sm tracking-wider">Parent PIN</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="break-inside-avoid">
                  <td className="border-2 border-slate-800 p-3 font-bold text-lg flex items-center gap-2">
                    <span>{student.avatar}</span> {student.name}
                  </td>
                  <td className="border-2 border-slate-800 p-3 font-mono text-lg">{student.pin || <span className="text-slate-400 italic text-sm">None</span>}</td>
                  <td className="border-2 border-slate-800 p-3 font-mono text-lg">{student.parentCode || 'N/A'}</td>
                  <td className="border-2 border-slate-800 p-3 font-mono text-lg">{student.parentPin || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 text-sm text-slate-500 italic print:mt-6">
            * Keep this document secure. Parent codes allow parents to view their child's classroom economy progress from home.
          </div>
        </div>
      )}
    </div>
  );
}

function TeacherStudentCard({ student, isActive, onClick, onClose, addTransaction }) {
  const [customAmount, setCustomAmount] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleAdd = (amount, reason) => {
    addTransaction(student.id, amount, reason);
    setCustomAmount('');
    setCustomReason('');
  };

  return (
    <div className="relative">
      <div onClick={onClick} className={`bg-white border-2 ${isActive ? 'border-sky-500 shadow-md ring-4 ring-sky-50' : 'border-slate-100'} hover:border-sky-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all h-[180px]`}>
         <div className="text-5xl mb-3 transform transition-transform group-hover:scale-110">{student.avatar}</div>
         <h3 className="font-bold text-slate-800 text-center line-clamp-1 w-full">{student.name}</h3>
         <p className="text-emerald-600 font-bold text-lg">${student.balance}</p>
      </div>

      {isActive && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-20 w-80 animate-in slide-in-from-top-2 duration-200">
           <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45"></div>
           <div className="flex justify-between items-center mb-4 relative z-10">
             <h4 className="font-bold text-slate-800 text-lg">Quick Transactions</h4>
             <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-400 hover:bg-slate-100 rounded-full p-1.5 transition-colors"><X size={18}/></button>
           </div>
           <div className="relative z-10">
             <div className="grid grid-cols-2 gap-2 mb-4">
               <button onClick={() => handleAdd(1, "Good Behavior")} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">+$1 Good</button>
               <button onClick={() => handleAdd(5, "Great Day")} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">+$5 Great</button>
               <button onClick={() => handleAdd(-1, "Warning")} className="bg-rose-50 hover:bg-rose-100 text-rose-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">-$1 Warning</button>
               <button onClick={() => handleAdd(-5, "Fine")} className="bg-rose-50 hover:bg-rose-100 text-rose-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">-$5 Fine</button>
             </div>
             <div className="flex gap-2">
               <input type="number" placeholder="$" className="w-20 border-2 border-slate-200 rounded-xl p-2 outline-none focus:border-sky-500 font-bold bg-slate-50 focus:bg-white text-center" value={customAmount} onChange={e => setCustomAmount(e.target.value)} />
               <input type="text" placeholder="Reason" className="flex-1 border-2 border-slate-200 rounded-xl p-2 outline-none focus:border-sky-500 text-sm font-bold bg-slate-50 focus:bg-white" value={customReason} onChange={e => setCustomReason(e.target.value)} />
               <button onClick={() => handleAdd(Number(customAmount) || 0, customReason || 'Adjustment')} className="bg-sky-500 hover:bg-sky-600 text-white px-3 rounded-xl font-bold transition-colors shadow-sm"><CheckCircle2 size={20}/></button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

function TabEditStudents({ students, updateDb, onAddStudent, onOpenPrint }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', pin: '' });
  const [studentToDelete, setStudentToDelete] = useState(null);

  const startEditing = (student) => {
    setEditingId(student.id);
    setEditForm({ name: student.name, pin: student.pin || '' });
  };

  const saveEdit = (id) => {
    updateDb(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, name: editForm.name, pin: editForm.pin } : s)
    }));
    setEditingId(null);
  };

  const updateAvatar = (id, avatar) => {
    updateDb(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, avatar } : s)
    }));
  };

  const confirmDelete = () => {
    if (!studentToDelete) return;
    updateDb(prev => ({ ...prev, students: prev.students.filter(s => s.id !== studentToDelete) }));
    setStudentToDelete(null);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-sky-500" /> Manage Students
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Edit names, update PINs, change avatars, or remove students.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button onClick={onOpenPrint} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
            <Printer size={18} /> Print
          </button>
          <button onClick={onAddStudent} className="bg-sky-50 hover:bg-sky-100 text-sky-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {students.map(student => {
            const isEditing = editingId === student.id;

            if (isEditing) {
              return (
                <div key={student.id} className="flex flex-col md:flex-row items-center gap-4 bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 animate-in fade-in duration-200">
                  <div className="relative group shrink-0">
                    <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={student.avatar} onChange={(e) => updateAvatar(student.id, e.target.value)}>
                      {avatars.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <div className="text-4xl bg-white rounded-xl p-2 shadow-sm border border-slate-200 group-hover:border-sky-300 transition-colors">
                      {student.avatar}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Student Name</label>
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} autoFocus className="w-full border-2 border-white rounded-xl p-2.5 outline-none focus:border-sky-400 font-bold bg-white shadow-sm" />
                    </div>
                    <div className="sm:w-32">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Login PIN</label>
                      <input type="text" value={editForm.pin} onChange={e => setEditForm({...editForm, pin: e.target.value})} placeholder="No PIN" className="w-full border-2 border-white rounded-xl p-2.5 outline-none focus:border-sky-400 font-bold bg-white shadow-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto justify-end mt-2 md:mt-6">
                    <button onClick={() => saveEdit(student.id)} className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-xl transition-colors shadow-sm"><CheckCircle2 size={20} /></button>
                    <button onClick={() => setEditingId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-600 p-3 rounded-xl transition-colors"><X size={20} /></button>
                  </div>
                </div>
              );
            }

            return (
              <div key={student.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="relative group shrink-0">
                  <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={student.avatar} onChange={(e) => updateAvatar(student.id, e.target.value)}>
                    {avatars.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <div className="text-4xl bg-white rounded-xl p-2 shadow-sm border border-slate-200 group-hover:border-sky-300 transition-colors">
                    {student.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-lg truncate">{student.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5">
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                      <Lock size={14} className={student.pin ? 'text-emerald-500' : 'text-slate-400'} />
                      PIN: {student.pin || 'None'}
                    </p>
                    <p className="text-sm text-slate-400 font-medium flex items-center gap-1 hidden sm:flex">
                      Parent Code: {student.parentCode || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEditing(student)} className="text-slate-400 hover:text-sky-500 hover:bg-sky-50 p-3 rounded-xl transition-colors">
                    <Edit3 size={20} />
                  </button>
                  <button onClick={() => setStudentToDelete(student.id)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-3 rounded-xl transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
          {students.length === 0 && <p className="text-center text-slate-500 py-8">No students to manage.</p>}
        </div>
      </div>

      <ActionModal 
        isOpen={!!studentToDelete}
        title="Remove Student?"
        message="This will delete the student and all of their saved money permanently."
        onConfirm={confirmDelete}
        onCancel={() => setStudentToDelete(null)}
        confirmText="Yes, Remove"
        type="danger"
        icon={Trash2}
      />
    </div>
  );
}

function TabJobs({ students, updateDb }) {
  const [loadingId, setLoadingId] = useState(null);

  const suggestJob = async (student) => {
    setLoadingId(student.id);
    try {
      const suggestion = await askGemini(`Suggest a fun classroom job and a weekly salary (between $5-$20) for a student named ${student.name}. Keep it short, like "Plant Doctor ($10)".`);
      const [job, salaryStr] = suggestion.split('($');
      const salary = parseInt(salaryStr) || 10;
      updateStudent(student.id, 'job', job ? job.trim() : "Assistant");
      updateStudent(student.id, 'salary', salary);
    } finally {
      setLoadingId(null);
    }
  };

  const updateStudent = (id, field, value) => {
    updateDb(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="text-purple-500" /> Classroom Jobs
        </h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Assign roles and set weekly salaries for payday.</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {students.map(student => (
            <div key={student.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 md:w-1/4">
                <span className="text-3xl">{student.avatar}</span>
                <span className="font-bold text-slate-800">{student.name}</span>
              </div>
              <div className="flex-1 flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                   <label className="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-wider">Job Title</label>
                   <input type="text" value={student.job || ''} onChange={(e) => updateStudent(student.id, 'job', e.target.value)} placeholder="e.g. Line Leader" className="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-500 font-bold bg-white" />
                </div>
                <div className="w-full md:w-32">
                   <label className="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-wider">Salary ($)</label>
                   <input type="number" value={student.salary || 0} onChange={(e) => updateStudent(student.id, 'salary', Number(e.target.value))} className="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-emerald-500 font-bold bg-white" />
                </div>
              </div>
              <div className="flex justify-end md:mt-5">
                <button onClick={() => suggestJob(student)} disabled={loadingId === student.id} className="text-purple-600 bg-purple-100 hover:bg-purple-200 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors disabled:opacity-50">
                  {loadingId === student.id ? <Loader2 size={18} className="animate-spin"/> : <Wand2 size={18}/>}
                  <span className="hidden sm:inline">AI Suggest</span>
                </button>
              </div>
            </div>
          ))}
          {students.length === 0 && <p className="text-center text-slate-500 py-8">No students to assign jobs to.</p>}
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ classId, db, updateDb, navigate }) {
  const [activeTab, setActiveTab] = useState('grid');
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState(null);
  const [showPaydayConfirm, setShowPaydayConfirm] = useState(false);
  const [showPaydaySuccess, setShowPaydaySuccess] = useState(false);
  
  const classData = db.classes.find(c => c.id === classId);
  const students = db.students.filter(s => s.classId === classId);

  const totalClassBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const communityGoal = classData?.communityGoal || { name: 'Class Goal', target: 1000 };
  const goalProgress = Math.min(100, (totalClassBalance / communityGoal.target) * 100);

  const addTransaction = (studentId, amount, reason) => {
    const newTx = { id: generateId(), studentId, amount, reason, timestamp: new Date().toISOString() };
    updateDb(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
      students: prev.students.map(s => s.id === studentId ? { ...s, balance: s.balance + amount } : s)
    }));
    setActiveStudentId(null);
  };

  const executePayday = () => {
    const newTxs = [];
    let updatedStudents = [...students];

    updatedStudents.forEach(student => {
      if (student.salary > 0) {
        newTxs.push({ id: generateId(), studentId: student.id, amount: student.salary, reason: `Weekly Salary: ${student.job}`, timestamp: new Date().toISOString() });
        student.balance += student.salary;
      }
    });

    updateDb(prev => ({
      ...prev,
      transactions: [...newTxs, ...prev.transactions],
      students: prev.students.map(s => updatedStudents.find(us => us.id === s.id) || s)
    }));
    
    setShowPaydayConfirm(false);
    setShowPaydaySuccess(true);
  };

  const tabs = [
    { id: 'grid', label: 'Dashboard', icon: LayoutGrid },
    { id: 'edit', label: 'Students', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (printType) {
    return <PrintView type={printType} students={students} classData={classData} onClose={() => setPrintType(null)} />;
  }

  // Determine current bank status indicator
  const bankStatus = checkBankStatus(classData.bankSettings);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 gap-4">
           <div>
             <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{classData?.name}</h1>
             <div className="flex items-center gap-4 mt-2">
               <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
                 <Users size={16} /> {students.length} Students active
               </p>
               <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${bankStatus.open ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                 {bankStatus.open ? <Unlock size={14}/> : <Lock size={14}/>}
                 {bankStatus.open ? 'Bank Open' : 'Bank Closed'}
               </div>
             </div>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
             <button onClick={() => setShowPaydayConfirm(true)} className="flex-1 md:flex-none bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
               <DollarSign size={20} /> Payday
             </button>
             <button onClick={() => navigate('role_selector')} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
               <LogOut size={20} /> Exit
             </button>
           </div>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-200' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'grid' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-0"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                        <Target size={16} className="text-sky-500" /> Community Goal
                      </h3>
                      <p className="text-xl font-extrabold text-slate-800">{communityGoal.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-sky-600">${totalClassBalance}</span>
                      <span className="text-slate-400 font-bold"> / ${communityGoal.target}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${goalProgress}%` }}>
                      <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <LayoutGrid className="text-sky-500" /> Quick Transactions
                  </h2>
                  <button onClick={() => setShowAddStudent(true)} className="bg-sky-50 hover:bg-sky-100 text-sky-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
                    <Plus size={18} /> Add Student
                  </button>
                </div>

                {students.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="text-6xl mb-4">🏫</div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No students yet</h3>
                    <button onClick={() => setShowAddStudent(true)} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-colors mt-4">
                      <Plus size={20} /> Add First Student
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {students.map(student => (
                      <TeacherStudentCard 
                        key={student.id} 
                        student={student} 
                        isActive={activeStudentId === student.id}
                        onClick={() => setActiveStudentId(student.id === activeStudentId ? null : student.id)}
                        onClose={() => setActiveStudentId(null)}
                        addTransaction={addTransaction}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'edit' && <TabEditStudents students={students} updateDb={updateDb} onAddStudent={() => setShowAddStudent(true)} onOpenPrint={() => setShowPrintModal(true)}/>}
          {activeTab === 'jobs' && <TabJobs students={students} updateDb={updateDb} />}
          {activeTab === 'store' && <TeacherStoreManager classId={classId} db={db} updateDb={updateDb} />}
          {activeTab === 'settings' && <TabSettings classData={classData} updateDb={updateDb} />}
        </div>
      </div>

      {showAddStudent && <AddStudentModal classId={classId} onClose={() => setShowAddStudent(false)} updateDb={updateDb} />}
      {showPrintModal && <PrintOptionsModal onClose={() => setShowPrintModal(false)} onPrint={(type) => { setPrintType(type); setShowPrintModal(false); }} />}

      <ActionModal isOpen={showPaydayConfirm} title="Distribute Weekly Pay?" message="This will add each student's weekly salary to their balance based on their assigned jobs." onConfirm={executePayday} onCancel={() => setShowPaydayConfirm(false)} confirmText="Pay Students" type="success" icon={DollarSign} />
      <ActionModal isOpen={showPaydaySuccess} title="Payday Complete!" message="All students have received their salaries for the week." onConfirm={() => setShowPaydaySuccess(false)} confirmText="Awesome" type="primary" icon={CheckCircle2} />
    </div>
  );
}

// --- Auth Views ---

function TeacherLogin({ db, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === db.teacherAuth.username && password === db.teacherAuth.password) {
      navigate('teacher_dash');
    } else {
      setErrorMsg('Invalid username or password.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">Teacher Login</h1>
          <p className="text-slate-500 mt-2 font-medium">Securely access your classroom dashboard.</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold p-3 rounded-xl mb-6 text-center">
           Hint for testing: Username <span className="underline">teacher</span> | Password <span className="underline">password123</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 flex items-center gap-2"><User size={16}/> Username</label>
            <input 
              type="text" 
              autoFocus
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500 text-lg font-bold bg-slate-50 focus:bg-white transition-colors" 
              placeholder="Enter username" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 flex items-center gap-2"><Key size={16}/> Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className={`w-full border-2 rounded-xl p-3 outline-none text-lg font-bold transition-colors ${errorMsg ? 'border-rose-300 focus:border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-purple-500 bg-slate-50 focus:bg-white'}`} 
              placeholder="••••••••" 
            />
          </div>
          
          {errorMsg && <p className="text-rose-500 font-bold text-sm text-center pt-2">{errorMsg}</p>}
          
          <div className="pt-4">
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-purple-200 mb-4">
              Login to Dashboard
            </button>
            <button type="button" onClick={() => navigate('role_selector')} className="w-full text-slate-400 hover:text-slate-600 font-bold transition-colors">
              ← Back to Start
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StudentLogin({ db, navigate }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pinEntry, setPinEntry] = useState('');
  const [pinError, setPinError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [bankStatus, setBankStatus] = useState({ open: true });

  const classData = db.classes[0];
  const students = db.students.filter(s => s.classId === classData?.id);

  // Recheck bank status periodically
  useEffect(() => {
    const check = () => setBankStatus(checkBankStatus(classData?.bankSettings));
    check(); // Initial check
    const interval = setInterval(check, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [classData]);

  if (!bankStatus.open) {
    return <BankClosedScreen reason={bankStatus.reason} onBack={() => navigate('role_selector')} />;
  }

  const handleStudentClick = (student) => {
    if (student.pin && student.pin.trim() !== '') {
      setSelectedStudent(student);
      setPinEntry('');
      setPinError('');
      setIsScanning(false);
    } else {
      navigate('student_dash', student.id);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinEntry === selectedStudent.pin) {
      navigate('student_dash', selectedStudent.id);
    } else {
      setPinError('Incorrect PIN. Try again!');
      setPinEntry('');
    }
  };

  const handleScanSuccess = (decodedText) => {
    const match = decodedText.match(/login\/(s-.*)/);
    if (match && match[1]) {
      const scannedId = match[1];
      if (selectedStudent && scannedId !== selectedStudent.id) {
        setPinError("That card doesn't belong to you!");
        setIsScanning(false);
        return;
      }
      const studentExists = students.find(s => s.id === scannedId);
      if (studentExists) {
        setIsScanning(false);
        navigate('student_dash', scannedId);
      } else {
        setPinError("Student not found.");
        setIsScanning(false);
      }
    } else {
      setPinError("Invalid QR Code.");
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-sky-100 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-inner">
            <Award size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">Who are you?</h1>
          <p className="text-slate-500 mt-2 font-medium">Find your name to open your bank.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {students.map(student => (
            <button key={student.id} onClick={() => handleStudentClick(student)} className="bg-white border-2 border-slate-100 hover:border-sky-400 hover:shadow-md rounded-2xl p-4 flex flex-col items-center justify-center transition-all group relative">
              {student.pin && <Lock size={14} className="absolute top-3 right-3 text-slate-300 group-hover:text-sky-400" />}
              <div className="text-5xl mb-3 transform transition-transform group-hover:scale-110 group-hover:-rotate-3">{student.avatar}</div>
              <span className="font-bold text-slate-700">{student.name}</span>
            </button>
          ))}
          {students.length === 0 && <p className="col-span-full text-center text-slate-400 py-8">Your teacher needs to add students first.</p>}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => navigate('role_selector')} className="text-slate-400 hover:text-slate-600 font-bold transition-colors">← Back to Start</button>
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-sm max-h-[95vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {isScanning ? (
              <div className="p-6">
                <RealQrScanner onScan={handleScanSuccess} onCancel={() => setIsScanning(false)} />
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">{selectedStudent.avatar}</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Enter PIN</h2>
                <form onSubmit={handlePinSubmit}>
                  <div className="flex gap-2 mb-4">
                    <input type="password" autoFocus value={pinEntry} onChange={e => setPinEntry(e.target.value)} className={`flex-1 text-center w-full text-2xl tracking-[0.5em] border-2 rounded-xl p-4 outline-none font-bold transition-colors ${pinError ? 'border-rose-300 focus:border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-sky-500 bg-slate-50 focus:bg-white'}`} placeholder="****" />
                    <button type="button" onClick={() => setIsScanning(true)} title="Scan QR Code instead" className="bg-slate-100 hover:bg-sky-50 text-slate-500 hover:text-sky-500 border-2 border-slate-100 hover:border-sky-200 rounded-xl px-4 flex items-center justify-center transition-all group">
                      <QrCode size={28} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  {pinError && <p className="text-rose-500 font-bold mb-4">{pinError}</p>}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSelectedStudent(null)} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold py-3 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-sky-200">Login</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StudentDashboard({ studentId, db, updateDb, navigate }) {
  const student = db.students.find(s => s.id === studentId);
  const classData = db.classes.find(c => c.id === student?.classId);
  
  const [bankStatus, setBankStatus] = useState({ open: true });
  
  // Recheck bank status while logged in
  useEffect(() => {
    const check = () => setBankStatus(checkBankStatus(classData?.bankSettings));
    check();
    const interval = setInterval(check, 10000); 
    return () => clearInterval(interval);
  }, [classData]);

  const transactions = db.transactions.filter(t => t.studentId === studentId).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  const storeItems = db.storeItems.filter(i => i.classId === student?.classId);

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalName, setGoalName] = useState(student?.savingsGoal?.name || '');
  const [goalTarget, setGoalTarget] = useState(student?.savingsGoal?.target || 50);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [itemToBuy, setItemToBuy] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");

  const getAiAdvice = async () => {
    setIsAiLoading(true);
    const prompt = `I am an elementary school student named ${student.name}. My current class money balance is $${student.balance}. My goal is to save $${student.savingsGoal?.target} for "${student.savingsGoal?.name}". I earn $${student.salary} a week as a ${student.job}. Give me one short, fun, encouraging sentence of financial advice using kid-friendly language.`;
    const advice = await askGemini(prompt);
    setAiAdvice(advice);
    setIsAiLoading(false);
    setTimeout(() => setAiAdvice(""), 8000);
  };

  const handleInitiateBuy = (item) => {
    if (student.balance >= item.cost) {
      setItemToBuy(item); 
    } else {
      setAlertMsg("You don't have enough money yet. Keep saving!"); 
    }
  };

  const confirmPurchase = () => {
    if (!itemToBuy) return;
    updateDb(prev => {
      const newTx = { id: generateId(), studentId, amount: -itemToBuy.cost, reason: `Bought ${itemToBuy.name}`, timestamp: new Date().toISOString() };
      const newStudents = prev.students.map(s => s.id === studentId ? { ...s, balance: s.balance - itemToBuy.cost } : s);
      return { ...prev, transactions: [newTx, ...prev.transactions], students: newStudents };
    });
    setItemToBuy(null);
  };

  if (!student) return null;

  // If the teacher locks the bank while they are logged in, show the closed screen over their dashboard
  if (!bankStatus.open) {
    return <BankClosedScreen reason={bankStatus.reason} onBack={() => navigate('role_selector')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200">
           <div className="flex items-center gap-4">
             <div className="text-5xl bg-sky-50 p-2 rounded-2xl">{student.avatar}</div>
             <div>
               <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Hi, {student.name}!</h1>
               <p className="text-slate-500 font-medium">{classData?.name}</p>
             </div>
           </div>
           <button onClick={() => navigate('role_selector')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
             <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-[2rem] p-8 shadow-lg shadow-emerald-200 relative overflow-hidden flex flex-col justify-center min-h-[160px] animate-in slide-in-from-bottom-4 duration-300">
             <div className="absolute -right-4 -bottom-4 text-[8rem] opacity-20 transform -rotate-12">💰</div>
             <h2 className="text-emerald-50 font-bold mb-2 uppercase tracking-widest text-sm relative z-10 flex items-center gap-2">My Balance</h2>
             <p className="text-7xl font-extrabold relative z-10 tracking-tighter">${student.balance}</p>
           </div>
           
           <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.03] group-hover:opacity-10 transition-opacity">💼</div>
               <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1"><Award size={14}/> Class Job</h3>
               <p className="text-xl font-extrabold text-slate-800 leading-tight mb-2 truncate" title={student.job || "No Job Yet"}>{student.job || "No Job Yet"}</p>
               <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-sm w-fit">+${student.salary || 0} / week</div>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden">
               {isEditingGoal ? (
                 <div className="flex flex-col gap-3 relative z-20 bg-white">
                   <input type="text" value={goalName} onChange={e=>setGoalName(e.target.value)} className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-sky-500 transition-colors" placeholder="Saving for..."/>
                   <div className="flex gap-2 items-center">
                     <span className="text-slate-500 font-bold bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">$</span>
                     <input type="number" value={goalTarget} onChange={e=>setGoalTarget(e.target.value)} className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold w-full outline-none focus:border-sky-500 transition-colors" placeholder="Amount"/>
                   </div>
                   <div className="flex gap-2 mt-1">
                     <button onClick={() => setIsEditingGoal(false)} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-sm font-bold py-2 transition-colors">Cancel</button>
                     <button onClick={() => {
                       updateDb(prev => ({
                         ...prev, students: prev.students.map(s => s.id === studentId ? { ...s, savingsGoal: { name: goalName, target: Number(goalTarget) } } : s)
                       }));
                       setIsEditingGoal(false);
                     }} className="flex-1 bg-sky-500 text-white hover:bg-sky-600 rounded-xl text-sm font-bold py-2 shadow-sm transition-colors">Save</button>
                   </div>
                 </div>
               ) : (
                 <>
                   <div className="flex justify-between items-start mb-2 relative z-20">
                     <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1"><TrendingUp size={14}/> Savings Goal</h3>
                     <div className="flex gap-1.5">
                       <button onClick={getAiAdvice} disabled={isAiLoading} className="text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 p-1.5 rounded-lg transition-colors disabled:opacity-50">
                         {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                       </button>
                       <button onClick={() => setIsEditingGoal(true)} className="text-slate-400 hover:text-sky-500 bg-slate-50 hover:bg-sky-50 p-1.5 rounded-lg transition-colors"><Edit3 size={16}/></button>
                     </div>
                   </div>
                   {aiAdvice && (
                     <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 p-4 flex items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                       <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl shadow-sm"><p className="text-sm font-bold text-purple-700 leading-snug">"{aiAdvice}"</p></div>
                     </div>
                   )}
                   <p className="text-lg font-extrabold text-slate-800 truncate mb-3 relative z-20" title={student.savingsGoal?.name}>{student.savingsGoal?.name || "Set a Goal!"}</p>
                   <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden relative z-20">
                     <div className="bg-sky-400 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${Math.min(100, (student.balance / (student.savingsGoal?.target || 1)) * 100)}%` }}>
                       <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 animate-[shimmer_2s_infinite]"></div>
                     </div>
                   </div>
                   <div className="flex justify-between text-xs font-bold text-slate-400 relative z-20">
                     <span className={student.balance >= student.savingsGoal?.target ? 'text-emerald-500 font-extrabold' : ''}>${student.balance}</span>
                     <span>Target: ${student.savingsGoal?.target || 0}</span>
                   </div>
                 </>
               )}
             </div>
           </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Store className="text-sky-500" /> Class Store</h2>
          </div>
          <div className="p-6">
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {storeItems.map(item => {
                const canAfford = student.balance >= item.cost;
                return (
                  <div key={item.id} className={`flex-none w-40 border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all snap-center ${canAfford ? 'border-slate-200 hover:border-sky-300 bg-white' : 'border-slate-100 bg-slate-50 opacity-75'}`}>
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight mb-3 flex-1">{item.name}</h3>
                    <button onClick={() => handleInitiateBuy(item)} className={`w-full py-2 rounded-xl font-bold text-sm transition-colors shadow-sm ${canAfford ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}>
                      {canAfford ? `Buy for $${item.cost}` : `Need $${item.cost}`}
                    </button>
                  </div>
                );
              })}
              {storeItems.length === 0 && <div className="w-full text-center text-slate-400 py-8 font-medium">The store is empty right now.</div>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="p-8 text-center text-slate-400 font-medium">No activity yet. Start earning!</p>
            ) : (
              transactions.map((tx, index) => (
                <div key={tx.id} className={`p-4 flex justify-between items-center hover:bg-slate-50 transition-colors ${index === 0 ? 'bg-sky-50/30' : ''}`}>
                  <div>
                    <p className="font-bold text-slate-800">{tx.reason}</p>
                    <p className="text-xs font-medium text-slate-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-extrabold text-lg ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-700'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ActionModal isOpen={!!itemToBuy} title="Confirm Purchase" message={`Are you sure you want to buy ${itemToBuy?.name} for $${itemToBuy?.cost}?`} onConfirm={confirmPurchase} onCancel={() => setItemToBuy(null)} confirmText="Yes, Buy It!" type="primary" icon={ShoppingBag} />
      <ActionModal isOpen={!!alertMsg} title="Keep Saving!" message={alertMsg} onConfirm={() => setAlertMsg("")} confirmText="Got It" type="danger" icon={AlertCircle} />

    </div>
  );
}

function RoleSelector({ navigate }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-500 text-white rounded-3xl rotate-3 shadow-lg mb-6">
            <DollarSign size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">Classroom Economy</h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">Manage classroom jobs, savings goals, and rewards all in one place.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div onClick={() => navigate('teacher_login')} className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-purple-400 hover:shadow-xl cursor-pointer transition-all group text-center relative">
            <div className="absolute top-4 right-4 bg-purple-100 text-purple-600 p-2 rounded-full"><Lock size={16} /></div>
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"><span className="text-5xl">👩‍🏫</span></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Teacher</h2>
            <p className="text-slate-500 font-medium">Manage students, jobs, and the class store.</p>
          </div>

          <div onClick={() => navigate('student_login')} className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-emerald-400 hover:shadow-xl cursor-pointer transition-all group text-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"><span className="text-5xl">🎒</span></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Student</h2>
            <p className="text-slate-500 font-medium">Check balance, buy items, and view goals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [db, setDb] = useState(initialDb);
  const [currentView, setCurrentView] = useState('role_selector');
  const [currentStudentId, setCurrentStudentId] = useState(null);

  const navigate = (view, studentId = null) => {
    setCurrentView(view);
    if (studentId) setCurrentStudentId(studentId);
  };

  return (
    <div className="font-sans text-slate-800 antialiased selection:bg-sky-200">
      {currentView === 'role_selector' && <RoleSelector navigate={navigate} />}
      {currentView === 'teacher_login' && <TeacherLogin db={db} navigate={navigate} />}
      {currentView === 'teacher_dash' && <TeacherDashboard classId={db.classes[0].id} db={db} updateDb={setDb} navigate={navigate} />}
      {currentView === 'student_login' && <StudentLogin db={db} navigate={navigate} />}
      {currentView === 'student_dash' && <StudentDashboard studentId={currentStudentId} db={db} updateDb={setDb} navigate={navigate} />}
    </div>
  );
}

