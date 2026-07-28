import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import PPGCorner from './pages/PPGCorner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hana-bg text-hana-navy pb-16">
        <Navbar />
        <main className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ppg-corner" element={<PPGCorner />} />
            <Route path="/contact" element={<div className="text-center py-12 font-bold">Halaman Kontak</div>} />
            <Route path="/admin" element={<div className="text-center py-12 font-bold">Panel Admin / CMS</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;