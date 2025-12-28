import { Routes, Route } from 'react-router';
import './App.css';
import Hero from './components/Hero';
import { Navbar } from './components/Navbar';
import UploadSection from './components/UploadSection';

function App() {
  return (
    <div className="app">
        <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/upload" element={<UploadSection />} />

      </Routes>
    </div>
  );
}

export default App;
