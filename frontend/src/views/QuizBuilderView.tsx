import React from 'react';
import { QuizBuilder } from '@/components/quiz/QuizBuilder';

export const QuizBuilderView: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <QuizBuilder />
    </div>
  );
};
