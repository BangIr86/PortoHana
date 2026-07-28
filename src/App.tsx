import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import PPGCorner from './pages/PPGCorner';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hana-bg text-hana-navy flex flex-col">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ppg-corner" element={<PPGCorner />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<div className="text-center py-20 font-bold text-2xl">Halaman Admin CMS (Tahap Backend) 🔒</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;