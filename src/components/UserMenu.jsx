import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMap, FiBookmark, FiLogOut, FiChevronDown, FiLayout } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

export const UserMenu = () => {
  const { user, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const displayName = profile?.name || user?.displayName || 'Traveler';
  const photo = profile?.photoURL || user?.photoURL;

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Could not log out');
    }
  };

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="user-menu-avatar">
          {photo ? <img src={photo} alt="" /> : getInitials(displayName)}
        </span>
        <span className="user-menu-name">{displayName.split(' ')[0]}</span>
        <FiChevronDown className={open ? 'rotated' : ''} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="user-menu-dropdown glass-card"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="user-menu-header">
              <strong>{displayName}</strong>
              <span>{user?.email}</span>
            </div>
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              <FiLayout /> Dashboard
            </Link>
            <Link to="/profile" onClick={() => setOpen(false)}>
              <FiUser /> Profile
            </Link>
            <Link to="/saved" onClick={() => setOpen(false)}>
              <FiMap /> My Trips
            </Link>
            <Link to="/discover" onClick={() => setOpen(false)}>
              <FiBookmark /> Saved Places
            </Link>
            <button type="button" className="user-menu-logout" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
