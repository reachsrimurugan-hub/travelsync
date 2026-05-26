import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserMenu } from './UserMenu';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';
import { SOUTH_INDIA_STATES } from '../services/placesService';

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { drawerOpen, setDrawerOpen, searchFilters, updateFilters } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [localOpen, setLocalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const open = drawerOpen || localOpen;

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const toggle = () => {
    setLocalOpen(!localOpen);
    setDrawerOpen(!drawerOpen);
  };
  const close = () => {
    setLocalOpen(false);
    setDrawerOpen(false);
  };

  const handleLocationChange = (e) => {
    const val = e.target.value;
    updateFilters({ state: val, district: '', location: val });
  };

  const mainNavLinks = [
    { path: '/discover', label: 'Discover' },
    { path: '/planner', label: 'Planner' },
    { path: '/ai-assistant', label: 'AI Assistant' },
  ];

  return (
    <>
      <header className={`navbar ${isHome ? 'navbar-home' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo" onClick={close}>
            {APP_NAME} <span>{APP_TAGLINE}</span>
          </Link>

          <nav className="navbar-links">
            {mainNavLinks.map((link) => (
              <NavLink key={link.path} to={link.path}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            <div className="navbar-location-wrapper">
              <FiMapPin className="location-icon" />
              <select
                className="navbar-location-select"
                value={searchFilters.state}
                onChange={handleLocationChange}
                aria-label="Select Location"
              >
                <option value="">All South India</option>
                {SOUTH_INDIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost navbar-btn-signin">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary navbar-btn-signup">
                  Sign Up
                </Link>
              </>
            )}
            <button type="button" className="navbar-hamburger" onClick={toggle} aria-label="Menu">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={close} role="presentation" />
      <motion.aside className={`drawer ${open ? 'open' : ''}`} initial={false} animate={{ x: open ? 0 : '100%' }}>
        <button type="button" className="btn btn-ghost" onClick={close} style={{ alignSelf: 'flex-end' }}>
          <FiX size={24} />
        </button>
        {mainNavLinks.map((link) => (
          <NavLink key={link.path} to={link.path} onClick={close}>
            {link.label}
          </NavLink>
        ))}
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" onClick={close}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" onClick={close}>
              Profile
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={close}>
              Sign In
            </NavLink>
            <NavLink to="/signup" onClick={() => { close(); navigate('/signup'); }}>
              Sign Up
            </NavLink>
          </>
        )}
      </motion.aside>
    </>
  );
};

