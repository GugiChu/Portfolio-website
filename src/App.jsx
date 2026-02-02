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
// Lazy Load Pages
const Releases = React.lazy(() => import('./components/Releases'));
const Login = React.lazy(() => import('./components/admin/Login'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));

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

  useEffect(() => {
    // Auth Check
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Show Loader until everything is ready
  // Note: We render children immediately behind logic but overlay covers them? 
  // Text says "till all assets get fetched", so we can return null OR overlay. 
  // Overlay is better for Transition. Let's return App with Loader on top.


  return (
    <Router>
      <div className="app-container">
        <React.Suspense fallback={
          <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050505', color: '#fff' }}>
            Loading...
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/releases" element={<Releases />} />
            <Route
              path="/master"
              element={user ? <AdminDashboard /> : <Login />}
            />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;