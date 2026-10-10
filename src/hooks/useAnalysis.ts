import { useContext } from 'react';
import { AnalysisContext, AnalysisContextType } from '../context/AnalysisContext';

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
