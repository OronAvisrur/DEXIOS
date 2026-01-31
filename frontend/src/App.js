import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Marketplace from './components/Marketplace';
import CreateGig from './components/CreateGig';
import MyGigs from './components/MyGigs';
import MyOrders from './components/MyOrders';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import './App.css';

function App() {
  const { toasts, showToast, removeToast } = useToast();

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace showToast={showToast} />} />
            <Route path="/create-gig" element={<CreateGig showToast={showToast} />} />
            <Route path="/my-gigs" element={<MyGigs showToast={showToast} />} />
            <Route path="/my-orders" element={<MyOrders showToast={showToast} />} />
          </Routes>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </Router>
  );
};

export default App;
