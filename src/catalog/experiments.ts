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
    id: 'simple-pendulum', field: 'physics', topic: 'Dao động',
    title: 'Con lắc đơn', question: 'Dây dài hơn thì con lắc dao động chậm hơn bao nhiêu?',
    href: '/physics/pendulum/simple', status: 'available',
  },
  {
    id: 'double-pendulum-chaos', field: 'physics', topic: 'Dao động và hỗn loạn',
    title: 'Con lắc kép', question: 'Sai khác rất nhỏ có thể làm chuyển động đổi khác đến đâu?',
    href: '/physics/oscillations/double-pendulum', status: 'available',
  },
  {
    id: 'mirror-maze', field: 'physics', topic: 'Quang học',
    title: 'Mê cung gương', question: 'Xoay một gương sẽ đổi đường đi của tia sáng ra sao?',
    href: '/physics/optics/mirror-maze', status: 'available',
  },
  {
    id: 'chemistry-preview', field: 'chemistry', topic: 'Khám phá vật chất',
    title: 'Hóa học đang đến', question: 'Điều gì xảy ra khi vật chất thay đổi?',
    href: '/chemistry', status: 'preview',
  },
];
