import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HERO_IMAGES } from '../utils/constants';
import { validateEmail, validatePassword } from '../utils/validateAuth';
import '../css/login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, loginWithGoogle, getRememberedEmail, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) setEmail(remembered);
  }, [getRememberedEmail]);

  const validate = () => {
    const errors = {};
    const e = validateEmail(email);
    const p = validatePassword(password);
    if (e) errors.email = e;
    if (p) errors.password = p;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isConfigured) {
      toast.error('Firebase is not configured. Check your .env file.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password, remember);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
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
      toast.success('Signed in with Google');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | TravelSync TripNest</title>
      </Helmet>
      <div
        className="auth-page login-page auth-page--mobile-visual"
        style={{ '--login-bg': `url(${HERO_IMAGES[2]})` }}
      >
        <div className="auth-visual" style={{ backgroundImage: `url(${HERO_IMAGES[2]})` }}>
          <div className="auth-visual-overlay" />
          <motion.div
            className="auth-visual-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>
              Welcome back, <span className="gradient-text">Explorer</span>
            </h2>
            <p>Sign in to sync your trips across devices with Firestore cloud.</p>
          </motion.div>
        </div>
        <div className="auth-form-side">
          <motion.div
            className="glass-card auth-form-card"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Sign in to continue your journey</p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={fieldErrors.password ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
              </div>
              <div className="form-row">
                <label className="remember-me">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <button type="submit" className="btn btn-primary auth-btn-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="auth-divider">or continue with</div>
            <div className="social-btns">
              <button type="button" className="social-btn" onClick={handleGoogle} disabled={loading}>
                <FcGoogle size={20} /> Google
              </button>
            </div>
            <p className="auth-footer-link">
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
