import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AnalysisProvider } from '../context/AnalysisContext';

export const App: React.FC = () => {
  return (
    <AnalysisProvider>
      <RouterProvider router={router} />
    </AnalysisProvider>
  );
};

export default App;
