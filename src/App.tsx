import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading pages untuk memecah bundle JS
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const PPGCorner = React.lazy(() => import('./pages/PPGCorner'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Admin = React.lazy(() => import('./pages/Admin'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hana-bg text-hana-navy flex flex-col">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 mt-4">
          <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center font-bold text-hana-navy">Memuat halaman...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ppg-corner" element={<PPGCorner />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;