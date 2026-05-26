import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SearchBar } from './SearchBar';
import { fetchPexelsImages, getOptimizedUrl } from '../services/imageService';

const CAROUSEL_DESTINATIONS = [
  {
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1920&q=80',
    title: 'Munnar',
    subtitle: 'Kerala',
    quote: 'Misty hills and rolling tea plantations'
  },
  {
    image: 'https://images.unsplash.com/photo-1622308644420-b0014cd70025?w=1920&q=80',
    title: 'Ooty',
    subtitle: 'Tamil Nadu',
    quote: 'Charming lake-side walks and scenic valleys'
  },
  {
    image: 'https://images.unsplash.com/photo-1595818970664-4be08209e45e?w=1920&q=80',
    title: 'Kodaikanal',
    subtitle: 'Tamil Nadu',
    quote: 'Lush green forests and star-shaped lakes'
  },
  {
    image: 'https://images.unsplash.com/photo-1593693411515-c202e974fe00?w=1920&q=80',
    title: 'Alleppey',
    subtitle: 'Kerala',
    quote: 'Serene houseboat cruises through emerald backwaters'
  },
  {
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80',
    title: 'Coorg',
    subtitle: 'Karnataka',
    quote: 'Aromatic coffee estates and misty peaks'
  },
  {
    image: 'https://images.unsplash.com/photo-1600100397608-f010e42ec0dc?w=1920&q=80',
    title: 'Hampi',
    subtitle: 'Karnataka',
    quote: 'Majestic ruins of the ancient Vijayanagara Empire'
  }
];

export const HeroSection = ({ onPlacesLoaded }) => {
  const [active, setActive] = useState(0);
  const [images, setImages] = useState(CAROUSEL_DESTINATIONS.map((d) => d.image));

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % CAROUSEL_DESTINATIONS.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let activeObserver = true;
    const fetchHeroBackgrounds = async () => {
      const promises = CAROUSEL_DESTINATIONS.map(async (dest) => {
        try {
          const query = `${dest.title} ${dest.subtitle}`;
          const urls = await fetchPexelsImages(query);
          if (urls && urls.length > 0) {
            return getOptimizedUrl(urls[0], 1920, 1080);
          }
        } catch (e) {
          console.error('Error fetching hero slide image:', e);
        }
        return dest.image;
      });
      const resolvedUrls = await Promise.all(promises);
      if (activeObserver) {
        setImages(resolvedUrls);
      }
    };
    fetchHeroBackgrounds();
    return () => {
      activeObserver = false;
    };
  }, []);

  const handlePrev = () => {
    setActive((a) => (a - 1 + CAROUSEL_DESTINATIONS.length) % CAROUSEL_DESTINATIONS.length);
  };

  const handleNext = () => {
    setActive((a) => (a + 1) % CAROUSEL_DESTINATIONS.length);
  };

  return (
    <section className="hero">
      <div className="hero-carousel">
        {CAROUSEL_DESTINATIONS.map((dest, i) => (
          <div
            key={dest.title}
            className={`hero-slide ${i === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${images[i] || dest.image})` }}
          />
        ))}
      </div>
      <div className="hero-overlay" />

      {/* Navigation Arrows */}
      <button
        type="button"
        className="hero-arrow hero-arrow-left"
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        type="button"
        className="hero-arrow hero-arrow-right"
        onClick={handleNext}
        aria-label="Next Slide"
      >
        <FiChevronRight size={24} />
      </button>

      <div className="hero-content container">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Discover South India's <span className="gradient-text">Unseen Marvels</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Explore Munnar's mist-covered hills, Alleppey's serene backwaters, and Hampi's ancient ruins with personalized AI itineraries tailored just for you.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/planner" className="btn btn-primary btn-lg">
            Start Planning
          </Link>
          <Link to="/discover" className="btn btn-outline btn-lg">
            Explore Places
          </Link>
        </motion.div>
      </div>

      {/* Carousel Caption (Bottom-Left) */}
      <div className="hero-slide-caption">
        <div className="caption-title">{CAROUSEL_DESTINATIONS[active].title}</div>
        <div className="caption-subtitle">{CAROUSEL_DESTINATIONS[active].subtitle}</div>
        <div className="caption-quote">"{CAROUSEL_DESTINATIONS[active].quote}"</div>
      </div>

      <div className="hero-indicators">
        {CAROUSEL_DESTINATIONS.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`hero-dot ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Floating Glassmorphism Search Bar */}
      <div className="hero-search-wrapper">
        <SearchBar onPlacesLoaded={onPlacesLoaded} />
      </div>
    </section>
  );
};

