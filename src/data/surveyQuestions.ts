export type SurveyQuestion = {
  id: string;
  text: string;
  type: 'choice' | 'text';
  options?: string[];
};

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 'q1',
    text: 'Seberapa puas Anda terhadap kualitas pekerjaan?',
    type: 'choice',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'q2',
    text: 'Seberapa puas Anda terhadap ketepatan waktu penyelesaian?',
    type: 'choice',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'q3',
    text: 'Seberapa puas Anda terhadap komunikasi tim?',
    type: 'choice',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'q4',
    text: 'Seberapa puas Anda terhadap dokumentasi/hasil akhir?',
    type: 'choice',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'q5',
    text: 'Seberapa puas Anda terhadap dukungan teknis?',
    type: 'choice',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'q_comment',
    text: 'Kritik dan saran (opsional)',
    type: 'text',
  },
];
