import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoCarousel from './components/VideoCarousel';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Login from './components/admin/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const Home = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <VideoCarousel />
      <Process />
      <Testimonials />
      <Contact />
      <FAQ />
    </main>
    <Footer />
  </>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/master"
            element={user ? <AdminDashboard /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;