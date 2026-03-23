import { ClassroomTimerModule } from './ClassroomTimerModule';

export const classroomTimerModule = {
  id: 'classroom-timer',
  name: 'Classroom Timer',
  description: 'Countdowns and quick time blocks',
  permissions: ['classroom-timer:view'],
  screen: ClassroomTimerModule
};
