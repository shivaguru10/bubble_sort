import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { PathGame } from './pages/PathGame';
import { BubblesGame } from './pages/BubblesGame';

function App() {
  return (
    <BrowserRouter basename="/bubble_sort">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/accenture" element={<Dashboard />} />
        <Route path="/game/path" element={<PathGame />} />
        <Route path="/game/bubbles" element={<BubblesGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
