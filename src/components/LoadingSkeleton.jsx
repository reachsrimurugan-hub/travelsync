export const CardSkeleton = () => (
  <div className="dest-card">
    <div className="skeleton skeleton-card" />
    <div style={{ padding: '1rem' }}>
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text short" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
