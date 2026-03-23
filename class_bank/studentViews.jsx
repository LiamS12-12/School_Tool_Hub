import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Award,
  DollarSign,
  Edit3,
  Key,
  Loader2,
  Lock,
  LogOut,
  QrCode,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  User
} from 'lucide-react';
import { askGemini, checkBankStatus, generateId } from './appHelpers';
import { ActionModal, BankClosedScreen, RealQrScanner } from './sharedComponents';

export function TeacherLogin({ db, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === db.teacherAuth.username && password === db.teacherAuth.password) {
      navigate('teacher_dash');
      return;
    }

    setErrorMsg('Invalid username or password.');
    setPassword('');
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
            <label className="block text-sm font-bold text-slate-600 mb-1.5 flex items-center gap-2"><User size={16} /> Username</label>
            <input type="text" autoFocus value={username} onChange={(event) => setUsername(event.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500 text-lg font-bold bg-slate-50 focus:bg-white transition-colors" placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1.5 flex items-center gap-2"><Key size={16} /> Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={`w-full border-2 rounded-xl p-3 outline-none text-lg font-bold transition-colors ${errorMsg ? 'border-rose-300 focus:border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-purple-500 bg-slate-50 focus:bg-white'}`} placeholder="••••••••" />
          </div>
          {errorMsg && <p className="text-rose-500 font-bold text-sm text-center pt-2">{errorMsg}</p>}
          <div className="pt-4">
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-purple-200 mb-4">Login to Dashboard</button>
            <button type="button" onClick={() => navigate('role_selector')} className="w-full text-slate-400 hover:text-slate-600 font-bold transition-colors">← Back to Start</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function StudentLogin({ db, navigate }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pinEntry, setPinEntry] = useState('');
  const [pinError, setPinError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [bankStatus, setBankStatus] = useState({ open: true });

  const classData = db.classes[0];
  const students = db.students.filter((student) => student.classId === classData?.id);

  useEffect(() => {
    const check = () => setBankStatus(checkBankStatus(classData?.bankSettings));
    check();
    const interval = setInterval(check, 10000);
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
      return;
    }

    navigate('student_dash', student.id);
  };

  const handlePinSubmit = (event) => {
    event.preventDefault();
    if (!selectedStudent) return;

    if (pinEntry === selectedStudent.pin) {
      navigate('student_dash', selectedStudent.id);
      return;
    }

    setPinError('Incorrect PIN. Try again!');
    setPinEntry('');
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

      const studentExists = students.find((student) => student.id === scannedId);
      if (studentExists) {
        setIsScanning(false);
        navigate('student_dash', scannedId);
      } else {
        setPinError('Student not found.');
        setIsScanning(false);
      }
      return;
    }

    setPinError('Invalid QR Code.');
    setIsScanning(false);
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
          {students.map((student) => (
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
                    <input type="password" autoFocus value={pinEntry} onChange={(event) => setPinEntry(event.target.value)} className={`flex-1 text-center w-full text-2xl tracking-[0.5em] border-2 rounded-xl p-4 outline-none font-bold transition-colors ${pinError ? 'border-rose-300 focus:border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-sky-500 bg-slate-50 focus:bg-white'}`} placeholder="****" />
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

export function StudentDashboard({ studentId, db, updateDb, navigate }) {
  const student = db.students.find((currentStudent) => currentStudent.id === studentId);
  const classData = db.classes.find((currentClass) => currentClass.id === student?.classId);
  const [bankStatus, setBankStatus] = useState({ open: true });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalName, setGoalName] = useState(student?.savingsGoal?.name || '');
  const [goalTarget, setGoalTarget] = useState(student?.savingsGoal?.target || 50);
  const [aiAdvice, setAiAdvice] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [itemToBuy, setItemToBuy] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const check = () => setBankStatus(checkBankStatus(classData?.bankSettings));
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [classData]);

  if (!student) return null;

  const transactions = db.transactions.filter((transaction) => transaction.studentId === studentId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const storeItems = db.storeItems.filter((item) => item.classId === student.classId);

  const getAiAdvice = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `I am an elementary school student named ${student.name}. My current class money balance is $${student.balance}. My goal is to save $${student.savingsGoal?.target} for "${student.savingsGoal?.name}". I earn $${student.salary} a week as a ${student.job}. Give me one short, fun, encouraging sentence of financial advice using kid-friendly language.`;
      const advice = await askGemini(prompt);
      setAiAdvice(advice);
      setTimeout(() => setAiAdvice(''), 8000);
    } catch (error) {
      console.error('AI advice failed:', error);
      setAiAdvice('Keep saving one step at a time. You are doing great!');
      setTimeout(() => setAiAdvice(''), 8000);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleInitiateBuy = (item) => {
    if (student.balance >= item.cost) {
      setItemToBuy(item);
      return;
    }
    setAlertMsg("You don't have enough money yet. Keep saving!");
  };

  const confirmPurchase = () => {
    if (!itemToBuy) return;
    updateDb((prev) => {
      const currentStudent = prev.students.find((savedStudent) => savedStudent.id === studentId);
      if (!currentStudent || currentStudent.balance < itemToBuy.cost) {
        return prev;
      }
      const newTx = { id: generateId(), studentId, amount: -itemToBuy.cost, reason: `Bought ${itemToBuy.name}`, timestamp: new Date().toISOString() };
      return {
        ...prev,
        transactions: [newTx, ...prev.transactions],
        students: prev.students.map((savedStudent) => savedStudent.id === studentId ? { ...savedStudent, balance: savedStudent.balance - itemToBuy.cost } : savedStudent)
      };
    });
    setItemToBuy(null);
  };

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
            <h2 className="text-emerald-50 font-bold mb-2 uppercase tracking-widest text-sm relative z-10">My Balance</h2>
            <p className="text-7xl font-extrabold relative z-10 tracking-tighter">${student.balance}</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.03] group-hover:opacity-10 transition-opacity">💼</div>
              <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1"><Award size={14} /> Class Job</h3>
              <p className="text-xl font-extrabold text-slate-800 leading-tight mb-2 truncate" title={student.job || 'No Job Yet'}>{student.job || 'No Job Yet'}</p>
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-sm w-fit">+${student.salary || 0} / week</div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden">
              {isEditingGoal ? (
                <div className="flex flex-col gap-3 relative z-20 bg-white">
                  <input type="text" value={goalName} onChange={(event) => setGoalName(event.target.value)} className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-sky-500 transition-colors" placeholder="Saving for..." />
                  <div className="flex gap-2 items-center">
                    <span className="text-slate-500 font-bold bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">$</span>
                    <input type="number" value={goalTarget} onChange={(event) => setGoalTarget(event.target.value)} className="border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold w-full outline-none focus:border-sky-500 transition-colors" placeholder="Amount" />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setIsEditingGoal(false)} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-sm font-bold py-2 transition-colors">Cancel</button>
                    <button onClick={() => { updateDb((prev) => ({ ...prev, students: prev.students.map((savedStudent) => savedStudent.id === studentId ? { ...savedStudent, savingsGoal: { name: goalName, target: Number(goalTarget) } } : savedStudent) })); setIsEditingGoal(false); }} className="flex-1 bg-sky-500 text-white hover:bg-sky-600 rounded-xl text-sm font-bold py-2 shadow-sm transition-colors">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2 relative z-20">
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1"><TrendingUp size={14} /> Savings Goal</h3>
                    <div className="flex gap-1.5">
                      <button onClick={getAiAdvice} disabled={isAiLoading} className="text-purple-500 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 p-1.5 rounded-lg transition-colors disabled:opacity-50">
                        {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      </button>
                      <button onClick={() => setIsEditingGoal(true)} className="text-slate-400 hover:text-sky-500 bg-slate-50 hover:bg-sky-50 p-1.5 rounded-lg transition-colors"><Edit3 size={16} /></button>
                    </div>
                  </div>
                  {aiAdvice && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 p-4 flex items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                      <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl shadow-sm"><p className="text-sm font-bold text-purple-700 leading-snug">"{aiAdvice}"</p></div>
                    </div>
                  )}
                  <p className="text-lg font-extrabold text-slate-800 truncate mb-3 relative z-20" title={student.savingsGoal?.name}>{student.savingsGoal?.name || 'Set a Goal!'}</p>
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
              {storeItems.map((item) => {
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
              transactions.map((transaction, index) => (
                <div key={transaction.id} className={`p-4 flex justify-between items-center hover:bg-slate-50 transition-colors ${index === 0 ? 'bg-sky-50/30' : ''}`}>
                  <div>
                    <p className="font-bold text-slate-800">{transaction.reason}</p>
                    <p className="text-xs font-medium text-slate-400">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-extrabold text-lg ${transaction.amount > 0 ? 'text-emerald-500' : 'text-slate-700'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ActionModal isOpen={!!itemToBuy} title="Confirm Purchase" message={`Are you sure you want to buy ${itemToBuy?.name} for $${itemToBuy?.cost}?`} onConfirm={confirmPurchase} onCancel={() => setItemToBuy(null)} confirmText="Yes, Buy It!" type="primary" icon={ShoppingBag} />
      <ActionModal isOpen={!!alertMsg} title="Keep Saving!" message={alertMsg} onConfirm={() => setAlertMsg('')} confirmText="Got It" type="danger" icon={AlertCircle} />
    </div>
  );
}

export function RoleSelector({ navigate }) {
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
