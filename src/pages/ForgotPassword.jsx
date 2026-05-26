import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMail, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HERO_IMAGES } from '../utils/constants';
import { validateEmail } from '../utils/validateAuth';
import '../css/signup.css';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const { resetPassword, isConfigured } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setFieldError(err);
      return;
    }
    setFieldError('');
    if (!isConfigured) {
      toast.error('Firebase is not configured.');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(email.trim());
      setSent(true);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | TravelSync TripNest</title>
      </Helmet>
      <div className="auth-page forgot-page auth-page--mobile-visual">
        <div className="auth-visual" style={{ backgroundImage: `url(${HERO_IMAGES[3]})` }}>
          <div className="auth-visual-overlay" />
        </div>
        <div className="auth-form-side">
          <motion.div
            className="glass-card auth-form-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link to="/login" className="forgot-back-link">
              <FiArrowLeft /> Back to login
            </Link>
            {sent ? (
              <div className="forgot-success">
                <FiCheckCircle size={48} />
                <h1>Check your inbox</h1>
                <p className="auth-subtitle">
                  We sent a password reset link to <strong>{email}</strong>
                </p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Return to login
                </Link>
              </div>
            ) : (
              <>
                <h1>Reset Password</h1>
                <p className="auth-subtitle">Enter your email and we&apos;ll send you a reset link</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="reset-email">Email</label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={fieldError ? 'input-error' : ''}
                    />
                    {fieldError && <p className="field-error">{fieldError}</p>}
                  </div>
                  <button type="submit" className="btn btn-primary auth-btn-submit" disabled={loading}>
                    {loading && <span className="btn-spinner" />}
                    <FiMail style={{ marginRight: '0.35rem' }} />
                    {loading ? 'Sending...' : 'Send Reset Email'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};
