import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, CreditCard, List, Loader2, Lock, X } from 'lucide-react';
import { useScript } from './appHelpers';

export function ActionModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger', icon: Icon }) {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200',
    primary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200'
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

export function RealQrScanner({ onScan, onCancel }) {
  const isLoaded = useScript('https://unpkg.com/html5-qrcode');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    let html5QrCode;
    let isUnmounted = false;

    const initScanner = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      html5QrCode = new window.Html5Qrcode('qr-reader');

      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (html5QrCode.isScanning) {
              html5QrCode.stop().then(() => onScan(decodedText)).catch(console.error);
            }
          },
          () => {}
        );

        if (isUnmounted && html5QrCode.isScanning) {
          html5QrCode.stop();
        }
      } catch (error) {
        if (!isUnmounted) {
          setErrorMsg('Camera access denied or unavailable. Please check your browser permissions.');
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

export function BankClosedScreen({ reason, onBack }) {
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

export function PrintOptionsModal({ onClose, onPrint }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <List className="text-sky-500" /> Print Options
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-200 text-slate-500 hover:bg-slate-300 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <button onClick={() => onPrint('cards')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-sky-400 hover:bg-sky-50 transition-all group flex items-start gap-4">
            <div className="bg-sky-100 text-sky-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <CreditCard size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Student Debit Cards</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Print cut-out cards with real QR codes for students to scan.</p>
            </div>
          </button>
          <button onClick={() => onPrint('list')} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-purple-400 hover:bg-purple-50 transition-all group flex items-start gap-4">
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

export function PrintView({ type, students, classData, onClose }) {
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
            {students.map((student) => {
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
                  {student.pin && <p className="mt-3 text-sm font-bold bg-slate-100 py-1.5 rounded-lg border border-slate-200">PIN: {student.pin}</p>}
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
              {students.map((student) => (
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
