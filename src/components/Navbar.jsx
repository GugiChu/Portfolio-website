import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="navbar-wrapper">
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="logo">
          <div className="logo-icon">
            <img src="../public/logo.jpg" alt="Logo" />
          </div>
          <span className="logo-text">
            Edixus<span className="logo-suffix"></span>
          </span>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#testimonial">Testimonial</a>
          </li>
          <li>
            <a href="#email">Email</a>
          </li>
        </ul>

        <button className="contact-btn desktop-only">Contact us</button>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <ul className="mobile-links">
          <li>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>
              Services
            </a>
          </li>
          <li>
            <a href="#work" onClick={() => setMobileMenuOpen(false)}>
              Work
            </a>
          </li>
          <li>
            <a href="#testimonial" onClick={() => setMobileMenuOpen(false)}>
              Testimonial
            </a>
          </li>
          <li>
            <a href="#email" onClick={() => setMobileMenuOpen(false)}>
              Email
            </a>
          </li>
        </ul>
        <button className="contact-btn mobile-btn">Contact us</button>
      </div>

      <style>{`
        /* ================= BASE (Desktop First) ================= */

.navbar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  max-width: 1100px;
  padding: 14px 28px;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(10, 10, 10, 0.85);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 1.1rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Desktop Nav */
.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  font-size: 0.95rem;
  color: #ccc;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #ffb944;
}

.contact-btn {
  background: #ffb944;
  color: #000;
  padding: 10px 24px;
  border-radius: 9999px;
  font-weight: 500;
}

/* ================= MOBILE TOGGLE ================= */

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  width: 22px;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: 0.3s;
}

/* ================= MOBILE MENU ================= */

.mobile-menu {
  position: fixed;
  inset: 0;
  background: #0e0e0e;
  padding-top: 120px;
  transform: translateY(-100%);
  transition: transform 0.35s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  z-index: 999;
}

.mobile-menu.open {
  transform: translateY(0);
}

.mobile-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 28px;
  font-size: 1.4rem;
}

.mobile-links a {
  color: #fff;
  text-decoration: none;
}

/* ================= MOBILE ================= */

@media (max-width: 767px) {
  .nav-links,
  .contact-btn {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .navbar {
    padding: 10px 18px;
    width: 84%;
    border-color: #ffb944;
  }

  .logo {
    font-size: 1rem;
  }
}

/* ================= TABLET ================= */

@media (min-width: 768px) and (max-width: 1023px) {
  .navbar {
    max-width: 85%;
    padding: 12px 24px;
    border-color: #ffb944;
  }

  .nav-links {
    gap: 16px;
  }

  .contact-btn {
    padding: 8px 20px;
    font-size: 0.9rem;
  }
}

/* ================= DESKTOP ================= */

@media (min-width: 1024px) {
  .navbar {
    max-width: 60%;
    border-color: #ffb944;
  }

  .nav-links {
    gap: 24px;
  }

  .nav-links a {
    font-size: 0.9rem;
  }
}

      `}</style>
    </div>
  );
};

export default Navbar;
