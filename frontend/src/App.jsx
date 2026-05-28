import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import TravelDetail from './pages/TravelDetail';
import Purchases from './pages/Purchases';

function App() {
  return (
    <BrowserRouter>
      <div className="noise-overlay"></div>
      <div className="top-[-10%] left-[-10vw] w-150 h-150 bgh-150/40 blob"></div>
      <div className="right-[-5vw] bottom-[-10%] bg-rose-200/40 w-125 h-125 blob" style={{ animationDelay: '-5s' }}></div>
      <div className="z-10 relative flex flex-col pt-24 min-h-screen text-gray-900">
        <Header />
        <main className="flex-1 mx-auto px-4 py-8 container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/travel/:id" element={<TravelDetail />} />
            <Route path="/my-tickets" element={<Purchases />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
