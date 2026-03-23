export const schoolContext = {
  school: {
    id: 'school-1',
    name: 'Evergreen Elementary'
  },
  currentUser: {
    id: 'teacher-1',
    name: 'Ms. Rivera',
    role: 'teacher'
  },
  teachers: [
    { id: 'teacher-1', name: 'Ms. Rivera' },
    { id: 'teacher-2', name: 'Mr. Patel' }
  ],
  classrooms: [
    { id: 'class-1', name: 'Ms. Rivera - Grade 3', teacherId: 'teacher-1' },
    { id: 'class-2', name: 'Mr. Patel - Grade 4', teacherId: 'teacher-2' }
  ],
  students: [
    { id: 'student-1', name: 'Ava Brooks', classroomId: 'class-1' },
    { id: 'student-2', name: 'Jayden Scott', classroomId: 'class-1' },
    { id: 'student-3', name: 'Mila Nguyen', classroomId: 'class-2' }
  ]
};
