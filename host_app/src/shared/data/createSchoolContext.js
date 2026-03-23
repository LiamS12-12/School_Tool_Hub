import {
  createClassroom,
  createSchool,
  createSchoolSettings,
  createStudent,
  createUser,
  ROLE_ADMIN,
  ROLE_TEACHER
} from './entities';
import { getVisibleClassrooms, getVisibleStudents } from '../permissions/schoolPermissions';

const school = createSchool({
  id: 'school-1',
  name: 'Evergreen Elementary'
});

const schoolSettings = createSchoolSettings({
  schoolName: 'Evergreen Elementary',
  primaryColor: '#0ea5e9',
  supportEmail: 'office@evergreen-elementary.edu'
});

const users = [
  createUser({
    id: 'admin-1',
    name: 'Principal Chen',
    role: ROLE_ADMIN,
    email: 'chen@evergreen-elementary.edu',
    enabledModules: ['classroom-economy', 'classroom-timer']
  }),
  createUser({
    id: 'teacher-1',
    name: 'Ms. Rivera',
    role: ROLE_TEACHER,
    email: 'rivera@evergreen-elementary.edu',
    enabledModules: ['classroom-economy', 'classroom-timer'],
    defaultClassroomId: 'class-1'
  }),
  createUser({
    id: 'teacher-2',
    name: 'Mr. Patel',
    role: ROLE_TEACHER,
    email: 'patel@evergreen-elementary.edu',
    enabledModules: ['classroom-timer'],
    defaultClassroomId: 'class-2'
  })
];

const classrooms = [
  createClassroom({ id: 'class-1', name: 'Ms. Rivera - Grade 3', gradeLevel: '3', teacherId: 'teacher-1' }),
  createClassroom({ id: 'class-2', name: 'Mr. Patel - Grade 4', gradeLevel: '4', teacherId: 'teacher-2' })
];

const students = [
  createStudent({ id: 'student-1', firstName: 'Ava', lastName: 'Brooks', classroomId: 'class-1' }),
  createStudent({ id: 'student-2', firstName: 'Jayden', lastName: 'Scott', classroomId: 'class-1' }),
  createStudent({ id: 'student-3', firstName: 'Mila', lastName: 'Nguyen', classroomId: 'class-2' })
];

export function createSchoolContext(currentUserId = 'teacher-1') {
  const currentUser = users.find((user) => user.id === currentUserId) || users[0];
  const classroomsById = Object.fromEntries(classrooms.map((classroom) => [classroom.id, classroom]));
  const visibleClassrooms = getVisibleClassrooms(currentUser, classrooms);
  const visibleStudents = getVisibleStudents(currentUser, students, classroomsById);

  return {
    school,
    schoolSettings,
    currentUser,
    users,
    classrooms,
    students,
    classroomsById,
    visibleClassrooms,
    visibleStudents,
    teacherProfile: {
      enabledModules: currentUser.enabledModules || [],
      defaultClassroomId: currentUser.defaultClassroomId || visibleClassrooms[0]?.id || null
    }
  };
}
