import React, { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Edit3,
  LayoutGrid,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Power,
  Printer,
  Settings,
  Sparkles,
  Store,
  Target,
  Trash2,
  Unlock,
  Users,
  Wand2,
  X
} from 'lucide-react';
import { avatars } from './appData';
import { askGemini, checkBankStatus, generateId, generateParentCode, generateParentPin } from './appHelpers';
import { ActionModal, BankClosedScreen, PrintOptionsModal, PrintView } from './sharedComponents';

export function TabSettings({ classData, updateDb }) {
  const settings = classData.bankSettings || {
    isOpen: true,
    hoursEnabled: false,
    startTime: '08:00',
    endTime: '15:00'
  };

  const updateSettings = (updates) => {
    updateDb((prev) => ({
      ...prev,
      classes: prev.classes.map((currentClass) => currentClass.id === classData.id
        ? { ...currentClass, bankSettings: { ...currentClass.bankSettings, ...updates } }
        : currentClass)
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
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Power className={settings.isOpen ? 'text-emerald-500' : 'text-rose-500'} />
                Manual Override
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Instantly lock or unlock the bank for all students.</p>
            </div>
            <button onClick={() => updateSettings({ isOpen: !settings.isOpen })} className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-sky-100 ${settings.isOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${settings.isOpen ? 'translate-x-11' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${settings.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {settings.isOpen ? <Unlock size={18} /> : <Lock size={18} />}
            {settings.isOpen ? 'The bank is currently OPEN. Students can log in.' : 'The bank is currently LOCKED. Students cannot log in right now.'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <input type="checkbox" id="hoursEnabled" checked={settings.hoursEnabled} onChange={(event) => updateSettings({ hoursEnabled: event.target.checked })} className="w-6 h-6 rounded-md text-sky-500 border-slate-300 focus:ring-sky-500 accent-sky-500 cursor-pointer" />
            <label htmlFor="hoursEnabled" className="text-lg font-bold text-slate-800 cursor-pointer flex items-center gap-2">
              <Clock className="text-sky-500" /> Enable Automatic School Hours
            </label>
          </div>
          <div className={`grid sm:grid-cols-2 gap-6 transition-opacity ${settings.hoursEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Bank Opens At</label>
              <input type="time" value={settings.startTime} onChange={(event) => updateSettings({ startTime: event.target.value })} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-lg font-bold bg-slate-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Bank Closes At</label>
              <input type="time" value={settings.endTime} onChange={(event) => updateSettings({ endTime: event.target.value })} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-lg font-bold bg-slate-50 focus:bg-white transition-colors" />
            </div>
          </div>
          {settings.hoursEnabled && (
            <p className="mt-4 text-sm text-slate-500 font-medium italic">
              * The bank will automatically lock outside of these hours while automatic school hours are enabled.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TeacherStoreManager({ classId, db, updateDb }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const storeItems = db.storeItems.filter((item) => item.classId === classId);

  const handleAiRestock = async () => {
    setIsGenerating(true);
    try {
      const prompt = 'Generate 4 fun, creative, non-monetary classroom rewards that elementary students can buy with fake classroom money. Return ONLY a valid JSON array of objects. Schema: [{ "name": "string (e.g. Teacher\'s Chair)", "cost": number (between 20 and 150), "icon": "string (a single emoji)" }]';
      const responseText = await askGemini(prompt);
      const jsonMatch = responseText.match(/\[.*\]/s);
      const newItems = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (newItems && Array.isArray(newItems)) {
        const formattedItems = newItems.map((item) => ({ id: generateId(), classId, name: item.name, cost: item.cost, icon: item.icon }));
        updateDb((prev) => ({ ...prev, storeItems: [...formattedItems, ...prev.storeItems] }));
        setIsOpen(true);
      } else {
        setAlertMsg("Oops! The AI didn't format the items correctly. Try again.");
      }
    } catch (error) {
      console.error('AI Generation failed:', error);
      setAlertMsg('Oops! The AI needs a quick recess. Try again in a moment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteItem = (itemId) => {
    updateDb((prev) => ({ ...prev, storeItems: prev.storeItems.filter((item) => item.id !== itemId) }));
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
        <button onClick={(event) => { event.stopPropagation(); handleAiRestock(); }} disabled={isGenerating} className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 w-full sm:w-auto justify-center">
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {isGenerating ? 'Generating Ideas...' : 'AI Idea Generator'}
        </button>
      </div>
      {isOpen && (
        <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {storeItems.map((item) => (
              <div key={item.id} className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative group hover:border-sky-300 transition-colors">
                <button onClick={() => deleteItem(item.id)} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 w-full leading-tight mb-2">{item.name}</h3>
                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mt-auto">${item.cost}</div>
              </div>
            ))}
            {storeItems.length === 0 && <div className="col-span-full py-8 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">No items in the store yet. Use the AI Generator to add some!</div>}
          </div>
        </div>
      )}
      <ActionModal isOpen={!!alertMsg} title="Store Update" message={alertMsg} onConfirm={() => setAlertMsg('')} confirmText="Okay" type="primary" icon={AlertCircle} />
    </div>
  );
}

export function AddStudentModal({ classId, onClose, updateDb }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

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
    updateDb((prev) => ({ ...prev, students: [...prev.students, newStudent] }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-3xl sm:rounded-[2rem] w-full max-w-md max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Add New Student</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 sm:mb-2">Student Name</label>
            <input type="text" autoFocus value={name} onChange={(event) => setName(event.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-base sm:text-lg font-bold" placeholder="e.g. Maya" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 sm:mb-2">Login PIN <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="text" value={pin} onChange={(event) => setPin(event.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-sky-500 text-base sm:text-lg font-bold" placeholder="e.g. 1234" />
          </div>
          <div className="flex flex-col flex-1">
            <label className="block text-sm font-bold text-slate-600 mb-1.5 sm:mb-2 shrink-0">Choose Avatar</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto p-2 bg-slate-50 rounded-xl border-2 border-slate-100 max-h-[35vh] sm:max-h-48">
              {avatars.map((avatar) => (
                <button key={avatar} onClick={() => setSelectedAvatar(avatar)} className={`text-2xl sm:text-3xl p-2 rounded-xl transition-all flex items-center justify-center ${selectedAvatar === avatar ? 'bg-sky-100 scale-110 shadow-sm' : 'hover:bg-slate-200 opacity-70 hover:opacity-100'}`}>
                  {avatar}
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

export function TeacherStudentCard({ student, isActive, onClick, onClose, addTransaction }) {
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
            <button onClick={(event) => { event.stopPropagation(); onClose(); }} className="text-slate-400 hover:bg-slate-100 rounded-full p-1.5 transition-colors"><X size={18} /></button>
          </div>
          <div className="relative z-10">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => handleAdd(1, 'Good Behavior')} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">+$1 Good</button>
              <button onClick={() => handleAdd(5, 'Great Day')} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">+$5 Great</button>
              <button onClick={() => handleAdd(-1, 'Warning')} className="bg-rose-50 hover:bg-rose-100 text-rose-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">-$1 Warning</button>
              <button onClick={() => handleAdd(-5, 'Fine')} className="bg-rose-50 hover:bg-rose-100 text-rose-700 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">-$5 Fine</button>
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="$" className="w-20 border-2 border-slate-200 rounded-xl p-2 outline-none focus:border-sky-500 font-bold bg-slate-50 focus:bg-white text-center" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} />
              <input type="text" placeholder="Reason" className="flex-1 border-2 border-slate-200 rounded-xl p-2 outline-none focus:border-sky-500 text-sm font-bold bg-slate-50 focus:bg-white" value={customReason} onChange={(event) => setCustomReason(event.target.value)} />
              <button onClick={() => handleAdd(Number(customAmount) || 0, customReason || 'Adjustment')} className="bg-sky-500 hover:bg-sky-600 text-white px-3 rounded-xl font-bold transition-colors shadow-sm"><CheckCircle2 size={20} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TabEditStudents({ students, updateDb, onAddStudent, onOpenPrint }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', pin: '' });
  const [studentToDelete, setStudentToDelete] = useState(null);

  const startEditing = (student) => {
    setEditingId(student.id);
    setEditForm({ name: student.name, pin: student.pin || '' });
  };

  const saveEdit = (id) => {
    updateDb((prev) => ({
      ...prev,
      students: prev.students.map((student) => student.id === id ? { ...student, name: editForm.name, pin: editForm.pin } : student)
    }));
    setEditingId(null);
  };

  const updateAvatar = (id, avatar) => {
    updateDb((prev) => ({
      ...prev,
      students: prev.students.map((student) => student.id === id ? { ...student, avatar } : student)
    }));
  };

  const confirmDelete = () => {
    if (!studentToDelete) return;
    updateDb((prev) => ({ ...prev, students: prev.students.filter((student) => student.id !== studentToDelete) }));
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
          {students.map((student) => {
            const isEditing = editingId === student.id;

            if (isEditing) {
              return (
                <div key={student.id} className="flex flex-col md:flex-row items-center gap-4 bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 animate-in fade-in duration-200">
                  <div className="relative group shrink-0">
                    <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={student.avatar} onChange={(event) => updateAvatar(student.id, event.target.value)}>
                      {avatars.map((avatar) => <option key={avatar} value={avatar}>{avatar}</option>)}
                    </select>
                    <div className="text-4xl bg-white rounded-xl p-2 shadow-sm border border-slate-200 group-hover:border-sky-300 transition-colors">
                      {student.avatar}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                    <div className="flex-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Student Name</label>
                      <input type="text" value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} autoFocus className="w-full border-2 border-white rounded-xl p-2.5 outline-none focus:border-sky-400 font-bold bg-white shadow-sm" />
                    </div>
                    <div className="sm:w-32">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Login PIN</label>
                      <input type="text" value={editForm.pin} onChange={(event) => setEditForm({ ...editForm, pin: event.target.value })} placeholder="No PIN" className="w-full border-2 border-white rounded-xl p-2.5 outline-none focus:border-sky-400 font-bold bg-white shadow-sm" />
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
                  <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={student.avatar} onChange={(event) => updateAvatar(student.id, event.target.value)}>
                    {avatars.map((avatar) => <option key={avatar} value={avatar}>{avatar}</option>)}
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
                  <button onClick={() => startEditing(student)} className="text-slate-400 hover:text-sky-500 hover:bg-sky-50 p-3 rounded-xl transition-colors"><Edit3 size={20} /></button>
                  <button onClick={() => setStudentToDelete(student.id)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-3 rounded-xl transition-colors"><Trash2 size={20} /></button>
                </div>
              </div>
            );
          })}
          {students.length === 0 && <p className="text-center text-slate-500 py-8">No students to manage.</p>}
        </div>
      </div>

      <ActionModal isOpen={!!studentToDelete} title="Remove Student?" message="This will delete the student and all of their saved money permanently." onConfirm={confirmDelete} onCancel={() => setStudentToDelete(null)} confirmText="Yes, Remove" type="danger" icon={Trash2} />
    </div>
  );
}

export function TabJobs({ students, updateDb }) {
  const [loadingId, setLoadingId] = useState(null);

  const updateStudent = (id, field, value) => {
    updateDb((prev) => ({
      ...prev,
      students: prev.students.map((student) => student.id === id ? { ...student, [field]: value } : student)
    }));
  };

  const suggestJob = async (student) => {
    setLoadingId(student.id);
    try {
      const suggestion = await askGemini(`Suggest a fun classroom job and a weekly salary (between $5-$20) for a student named ${student.name}. Keep it short, like "Plant Doctor ($10)".`);
      const [job, salaryStr] = suggestion.split('($');
      const salary = parseInt(salaryStr, 10) || 10;
      updateStudent(student.id, 'job', job ? job.trim() : 'Assistant');
      updateStudent(student.id, 'salary', salary);
    } finally {
      setLoadingId(null);
    }
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
          {students.map((student) => (
            <div key={student.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 md:w-1/4">
                <span className="text-3xl">{student.avatar}</span>
                <span className="font-bold text-slate-800">{student.name}</span>
              </div>
              <div className="flex-1 flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-wider">Job Title</label>
                  <input type="text" value={student.job || ''} onChange={(event) => updateStudent(student.id, 'job', event.target.value)} placeholder="e.g. Line Leader" className="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-500 font-bold bg-white" />
                </div>
                <div className="w-full md:w-32">
                  <label className="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-wider">Salary ($)</label>
                  <input type="number" value={student.salary || 0} onChange={(event) => updateStudent(student.id, 'salary', Number(event.target.value))} className="w-full border-2 border-slate-200 rounded-xl p-2.5 outline-none focus:border-emerald-500 font-bold bg-white" />
                </div>
              </div>
              <div className="flex justify-end md:mt-5">
                <button onClick={() => suggestJob(student)} disabled={loadingId === student.id} className="text-purple-600 bg-purple-100 hover:bg-purple-200 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors disabled:opacity-50">
                  {loadingId === student.id ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
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

export function TeacherDashboard({ classId, db, updateDb, navigate }) {
  const [activeTab, setActiveTab] = useState('grid');
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState(null);
  const [showPaydayConfirm, setShowPaydayConfirm] = useState(false);
  const [showPaydaySuccess, setShowPaydaySuccess] = useState(false);

  const classData = db.classes.find((currentClass) => currentClass.id === classId);
  const students = db.students.filter((student) => student.classId === classId);

  if (!classData) {
    return <BankClosedScreen reason="This class could not be found." onBack={() => navigate('role_selector')} />;
  }

  const totalClassBalance = students.reduce((sum, student) => sum + student.balance, 0);
  const communityGoal = classData.communityGoal || { name: 'Class Goal', target: 1000 };
  const goalProgress = Math.min(100, (totalClassBalance / communityGoal.target) * 100);

  const addTransaction = (studentId, amount, reason) => {
    const newTx = { id: generateId(), studentId, amount, reason, timestamp: new Date().toISOString() };
    updateDb((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
      students: prev.students.map((student) => student.id === studentId ? { ...student, balance: student.balance + amount } : student)
    }));
    setActiveStudentId(null);
  };

  const executePayday = () => {
    const newTxs = [];
    const updatedStudents = students.map((student) => {
      if (student.salary > 0) {
        newTxs.push({ id: generateId(), studentId: student.id, amount: student.salary, reason: `Weekly Salary: ${student.job}`, timestamp: new Date().toISOString() });
        return { ...student, balance: student.balance + student.salary };
      }
      return student;
    });

    updateDb((prev) => ({
      ...prev,
      transactions: [...newTxs, ...prev.transactions],
      students: prev.students.map((student) => updatedStudents.find((updatedStudent) => updatedStudent.id === student.id) || student)
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

  const bankStatus = checkBankStatus(classData.bankSettings);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{classData.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
                <Users size={16} /> {students.length} Students active
              </p>
              <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${bankStatus.open ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {bankStatus.open ? <Unlock size={14} /> : <Lock size={14} />}
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
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-sky-500 text-white shadow-md shadow-sky-200' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
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
                    {students.map((student) => (
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

          {activeTab === 'edit' && <TabEditStudents students={students} updateDb={updateDb} onAddStudent={() => setShowAddStudent(true)} onOpenPrint={() => setShowPrintModal(true)} />}
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
