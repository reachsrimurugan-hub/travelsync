import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const NotFound = () => (
  <>
    <Helmet>
      <title>404 | TravelSync TripNest</title>
    </Helmet>
    <div className="not-found page-wrapper">
      <h1>404</h1>
      <h2>Lost in transit?</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  </>
);
