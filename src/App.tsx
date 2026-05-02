import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { HospitalsPage } from './pages/HospitalsPage';
import { HospitalDetailPage } from './pages/HospitalDetailPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { TimingsPage } from './pages/TimingsPage';
import { AdminPage } from './pages/AdminPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { HospitalProvider } from './context/HospitalContext';
import './i18n';

function App() {
  return (
    <HospitalProvider>
      <Router>
        <div className="min-h-screen bg-slate-100 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hospitals" element={<HospitalsPage />} />
              <Route path="/hospital/:hospitalId" element={<HospitalDetailPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/timings" element={<TimingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HospitalProvider>
  );
}

export default App;