import { SlidesAnnotatorModule } from './SlidesAnnotatorModule';

export const slidesAnnotatorModule = {
  id: 'slides-annotator',
  name: 'Slides Annotator',
  description: 'Presentations, annotations, and teaching overlays',
  permissions: ['slides-annotator:view'],
  screen: SlidesAnnotatorModule,
};