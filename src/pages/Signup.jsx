import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HERO_IMAGES } from '../utils/constants';
import { validateSignup } from '../utils/validateAuth';
import { getPasswordStrength, isPasswordStrongEnough } from '../utils/passwordStrength';
import '../css/signup.css';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { signup, loginWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateSignup({ name, email, password, confirm });
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;
    if (!isPasswordStrongEnough(password)) {
      toast.error('Please use a stronger password (min. 6 characters)');
      return;
    }
    if (!isConfigured) {
      toast.error('Firebase is not configured. Check your .env file.');
      return;
    }
    setLoading(true);
    try {
      await signup(email.trim(), password, name.trim());
      toast.success('Account created! Welcome to TravelSync.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isConfigured) {
      toast.error('Firebase is not configured.');
      return;
    }
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | TravelSync TripNest</title>
      </Helmet>
      <div
        className="auth-page signup-page auth-page--mobile-visual"
        style={{ '--signup-bg': `url(${HERO_IMAGES[0]})` }}
      >
        <div className="auth-visual" style={{ backgroundImage: `url(${HERO_IMAGES[0]})` }}>
          <div className="auth-visual-overlay" />
          <motion.div
            className="auth-visual-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>
              Start your <span className="gradient-text">Adventure</span>
            </h2>
            <p>Plan trips, save destinations, and sync with Firestore cloud.</p>
            <ul className="signup-benefits">
              <li>AI travel assistant</li>
              <li>Cloud trip planner</li>
              <li>Real-time sync</li>
            </ul>
          </motion.div>
        </div>
        <div className="auth-form-side">
          <motion.div
            className="glass-card auth-form-card"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>
              Create <span className="gradient-text">Account</span>
            </h1>
            <p className="auth-subtitle">Join TravelSync TripNest today</p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={fieldErrors.name ? 'input-error' : ''}
                />
                {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldErrors.email ? 'input-error' : ''}
                />
                {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrap">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={fieldErrors.password ? 'input-error' : ''}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {password && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      <div
                        className="password-strength-fill"
                        style={{ width: `${strength.percent}%`, background: strength.color }}
                      />
                    </div>
                    <span className="password-strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
                {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={fieldErrors.confirm ? 'input-error' : ''}
                />
                {fieldErrors.confirm && <p className="field-error">{fieldErrors.confirm}</p>}
              </div>
              <button type="submit" className="btn btn-primary auth-btn-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <div className="auth-divider">or</div>
            <button type="button" className="social-btn" style={{ width: '100%' }} onClick={handleGoogle} disabled={loading}>
              <FcGoogle size={20} /> Sign up with Google
            </button>
            <p className="auth-footer-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
