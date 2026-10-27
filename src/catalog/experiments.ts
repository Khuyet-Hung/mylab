export type ExperimentCard = {
  id: string;
  field: 'physics' | 'chemistry';
  topic: string;
  title: string;
  question: string;
  href: string;
  status: 'available' | 'preview';
};

export const experiments: ExperimentCard[] = [
  {
    id: 'free-fall', field: 'physics', topic: 'Trọng lực',
    title: 'Hai vật rơi tự do', question: 'Vật nặng có rơi nhanh hơn không?',
    href: '/physics/gravity/free-fall', status: 'available',
  },
  {
    id: 'chemistry-preview', field: 'chemistry', topic: 'Khám phá vật chất',
    title: 'Hóa học đang đến', question: 'Điều gì xảy ra khi vật chất thay đổi?',
    href: '/chemistry', status: 'preview',
  },
];
