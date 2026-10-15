import React from 'react';
import { LifePathAssessment } from './LifePathAssessment';
import { Course } from '../types';

interface LifePathBuilderProps {
  onSelectCourse?: (course: Course) => void;
}

export const LifePathBuilder: React.FC<LifePathBuilderProps> = ({
  onSelectCourse
}) => {
  return (
    <div className="min-h-screen bg-slate-50 font-['Mitr',sans-serif]">
      <LifePathAssessment
        onSelectCourse={onSelectCourse}
      />
    </div>
  );
};
