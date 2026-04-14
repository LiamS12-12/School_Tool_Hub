import { GroupMakerModule } from './GroupMakerModule';

export const groupMakerModule = {
  id: 'group-maker',
  name: 'Group Maker',
  description: 'Build random student groups from the shared class roster',
  permissions: ['group-maker:view'],
  screen: GroupMakerModule,
};