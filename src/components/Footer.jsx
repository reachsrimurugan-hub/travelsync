import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3 className="gradient-text">
              {APP_NAME} <span>{APP_TAGLINE}</span>
            </h3>
            <p>AI-powered travel planning. Discover, plan, and explore South India with ease and confidence.</p>
            <div className="footer-social" style={{ marginTop: '1.5rem' }}>
              <a href="#twitter" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="#instagram" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="#linkedin" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
              <a href="#github" aria-label="GitHub">
                <FiGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/discover">Discover Places</Link>
            <Link to="/planner">Trip Planner</Link>
            <Link to="/ai-assistant">AI Travel Guide</Link>
            <Link to="/profile">My Profile</Link>
          </div>

          {/* Contact Info */}
          <div className="footer-col footer-contact">
            <h4>Contact Us</h4>
            <p>
              <FiMapPin className="contact-icon" /> 102 Metro Towers, Chennai, TN, India
            </p>
            <p>
              <FiPhone className="contact-icon" /> +91 44 2468 1357
            </p>
            <p>
              <FiMail className="contact-icon" /> support@travelsync.com
            </p>
          </div>

          {/* Newsletter */}
          <div className="footer-col footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to get travel guides, itinerary tips, and exclusive South India offers.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe">
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

