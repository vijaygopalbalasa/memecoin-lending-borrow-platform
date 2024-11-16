import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Borrow from './pages/Borrow';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Navbar />
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/borrow" element={<Borrow />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'bg-gray-800 text-white',
            duration: 5000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;