export const classroomEconomyData = {
  classroomGoals: {
    'class-1': {
      name: 'Class Pizza Party',
      targetAmount: 1000
    },
    'class-2': {
      name: 'Outdoor Game Day',
      targetAmount: 800
    }
  },
  accounts: {
    'student-1': {
      balance: 45,
      jobTitle: 'Plant Monitor',
      weeklySalary: 10,
      savingsGoal: { name: 'Fossil Kit', targetAmount: 100 }
    },
    'student-2': {
      balance: 120,
      jobTitle: 'Line Leader',
      weeklySalary: 15,
      savingsGoal: { name: 'Art Set', targetAmount: 150 }
    },
    'student-3': {
      balance: 35,
      jobTitle: 'Tech Helper',
      weeklySalary: 8,
      savingsGoal: { name: 'Puzzle Book', targetAmount: 60 }
    }
  },
  storeItems: {
    'class-1': [
      { id: 'reward-1', name: 'Homework Pass', cost: 50 },
      { id: 'reward-2', name: 'Choose Your Seat', cost: 100 },
      { id: 'reward-3', name: 'Free Drawing Time', cost: 30 }
    ],
    'class-2': [
      { id: 'reward-4', name: 'Read to the Class', cost: 40 },
      { id: 'reward-5', name: 'Game Time', cost: 60 }
    ]
  },
  transactions: {
    'class-1': [
      {
        id: 'tx-1',
        studentId: 'student-1',
        amount: 10,
        reason: 'Weekly Salary: Plant Monitor',
        timestamp: '2026-03-20T15:00:00.000Z'
      },
      {
        id: 'tx-2',
        studentId: 'student-2',
        amount: -15,
        reason: 'Bought Free Drawing Time',
        timestamp: '2026-03-21T15:00:00.000Z'
      }
    ],
    'class-2': [
      {
        id: 'tx-3',
        studentId: 'student-3',
        amount: 8,
        reason: 'Weekly Salary: Tech Helper',
        timestamp: '2026-03-20T15:00:00.000Z'
      }
    ]
  }
};
