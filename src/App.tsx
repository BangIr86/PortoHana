import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hana-bg text-hana-navy pb-16">
        <Navbar />
        <main className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div className="text-center py-12 font-bold">Halaman About (Next Step)</div>} />
            <Route path="/ppg-corner" element={<div className="text-center py-12 font-bold">Halaman PPG Corner (Next Step)</div>} />
            <Route path="/contact" element={<div className="text-center py-12 font-bold">Halaman Kontak</div>} />
            <Route path="/admin" element={<div className="text-center py-12 font-bold">Panel Admin / CMS</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;