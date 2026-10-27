import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import CalendarApp from './components/CalendarApp';
import LandingPage from './components/LandingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing-page" replace />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/home" element={<CalendarApp />} />
    </Routes>
  );
}
