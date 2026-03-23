export const ROLE_ADMIN = 'admin';
export const ROLE_TEACHER = 'teacher';

export function createSchool({ id, name, shortName = name }) {
  return {
    id,
    name,
    shortName
  };
}

export function createUser({ id, name, role, email = '' }) {
  return {
    id,
    name,
    role,
    email,
    isActive: true
  };
}

export function createClassroom({ id, name, gradeLevel, teacherId }) {
  return {
    id,
    name,
    gradeLevel,
    teacherId,
    isActive: true
  };
}

export function createStudent({ id, firstName, lastName, classroomId }) {
  return {
    id,
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`.trim(),
    classroomId,
    isActive: true
  };
}

export function createSchoolSettings({ schoolName, primaryColor = '#0ea5e9', supportEmail = '' }) {
  return {
    schoolName,
    primaryColor,
    supportEmail
  };
}
