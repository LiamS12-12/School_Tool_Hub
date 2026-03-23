import { ROLE_ADMIN } from '../data/entities';

export function isAdmin(user) {
  return user?.role === ROLE_ADMIN;
}

export function canViewClassroom(user, classroom) {
  if (!user || !classroom) return false;
  if (isAdmin(user)) return true;
  return classroom.teacherId === user.id;
}

export function canManageClassroom(user, classroom) {
  return canViewClassroom(user, classroom);
}

export function canViewStudent(user, student, classroomsById) {
  if (!user || !student) return false;
  const classroom = classroomsById[student.classroomId];
  return canViewClassroom(user, classroom);
}

export function getVisibleClassrooms(user, classrooms) {
  return classrooms.filter((classroom) => canViewClassroom(user, classroom));
}

export function getVisibleStudents(user, students, classroomsById) {
  return students.filter((student) => canViewStudent(user, student, classroomsById));
}

export function canManageHostSettings(user) {
  return isAdmin(user);
}

export function canAccessModule(user, module) {
  if (!user || !module) return false;
  if (isAdmin(user)) return true;
  return (user.enabledModules || []).includes(module.id);
}

export function getEnabledModules(user, modules) {
  return modules.filter((module) => canAccessModule(user, module));
}
