import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MemeMaker from './pages/MemeMaker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/meme-maker" element={<MemeMaker />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;