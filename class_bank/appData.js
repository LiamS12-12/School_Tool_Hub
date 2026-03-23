export const initialDb = {
  teacherAuth: { username: 'teacher', password: 'password123' },
  classes: [{
    id: 'class-1',
    name: "Mrs. Frizzle's 3rd Grade",
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
    { id: 's-3', classId: 'class-1', name: 'Carlos', pin: '', avatar: '👦', balance: 10, job: 'Comedian', salary: 5, savingsGoal: { name: 'Joke Book', target: 20 }, parentCode: 'LMN-456', parentPin: '9988' }
  ],
  storeItems: [
    { id: 'i-1', classId: 'class-1', name: 'Homework Pass', cost: 50, icon: '🎟️' },
    { id: 'i-2', classId: 'class-1', name: 'Furry Friend on Desk', cost: 30, icon: '🧸' },
    { id: 'i-3', classId: 'class-1', name: 'Choose Your Seat', cost: 100, icon: '🪑' },
    { id: 'i-4', classId: 'class-1', name: '10 Min Free Time', cost: 40, icon: '⏱️' },
    { id: 'i-5', classId: 'class-1', name: 'Listen to Music', cost: 60, icon: '🎧' }
  ],
  transactions: []
};

export const avatars = ['👦', '👧', '🧑', '👨', '👩', '👱‍♂️', '👱‍♀️', '🧑‍🦱', '👩‍🦱', '🧑‍🦰', '👩‍🦰', '🦊', '🐱', '🐼', '🐸', '🐵', '🦄', '🦖', '🐙', '🐝'];
