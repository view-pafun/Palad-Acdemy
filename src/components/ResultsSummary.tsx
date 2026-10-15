import React from 'react';
import { SboAssessmentResult } from '../data/assessmentQuestions';
import { CosmicResultDashboard } from './CosmicResultDashboard';
import { Course } from '../types';

export interface ResultsSummaryProps {
  answers?: Record<number, number>;
  profileResult?: SboAssessmentResult;
  userName?: string;
  onRetake?: () => void;
  onSelectCourse?: (course: Course) => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  answers = {},
  userName = 'ผู้เข้ารับการประเมิน',
  onRetake,
  onSelectCourse,
}) => {
  return (
    <CosmicResultDashboard
      answers={answers}
      userName={userName}
      onRetake={onRetake}
      onSelectCourse={onSelectCourse}
      isStudentDashboardView={false}
    />
  );
};
