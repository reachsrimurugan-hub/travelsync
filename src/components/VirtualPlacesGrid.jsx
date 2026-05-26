import { useState, useEffect, useMemo, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DestinationCard } from './DestinationCard';

export const VirtualPlacesGrid = ({ places = [], onViewDetails, onShowOnMap, exploreLabel = 'Explore' }) => {
  const [columns, setColumns] = useState(1);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      
      // Calculate columns based on responsive break-points
      let cols = 1;
      if (containerWidth >= 900) {
        cols = 3;
      } else if (containerWidth >= 550) {
        cols = 2;
      }
      setColumns(cols);
      setWidth(containerWidth);

      // Determine viewport height offset
      const viewportHeight = window.innerHeight;
      const calculatedHeight = window.innerWidth >= 1024 
        ? Math.max(400, viewportHeight - 240) // sticky layout height
        : Math.min(550, places.length * 360); // mobile/tablet dynamic height
      setHeight(calculatedHeight);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(containerRef.current);

    window.addEventListener('resize', updateSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [places.length]);

  // Chunk array into rows
  const rows = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < places.length; i += columns) {
      chunks.push(places.slice(i, i + columns));
    }
    return chunks;
  }, [places, columns]);

  // Card height configuration
  const rowHeight = useMemo(() => {
    if (columns === 1) return 330;
    if (columns === 2) return 390;
    return 430;
  }, [columns]);

  const Row = ({ index, style }) => {
    const rowPlaces = rows[index];
    const gridGap = 20; // px (matches --card-gap / 1.25rem)

    return (
      <div
        style={{
          ...style,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gridGap}px`,
          paddingRight: '8px',
          paddingBottom: `${gridGap}px`,
          boxSizing: 'border-box',
        }}
      >
        {rowPlaces.map((place, colIndex) => {
          const absoluteIndex = index * columns + colIndex;
          return (
            <div key={place.id} style={{ height: `${rowHeight - gridGap}px` }}>
              <DestinationCard
                place={place}
                index={absoluteIndex}
                onViewDetails={onViewDetails}
                onShowOnMap={onShowOnMap}
                exploreLabel={exploreLabel}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      {width > 0 && rows.length > 0 ? (
        <List
          height={height}
          itemCount={rows.length}
          itemSize={rowHeight}
          width={width}
          style={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
          {Row}
        </List>
      ) : (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <span>Preparing destination grid…</span>
        </div>
      )}
    </div>
  );
};
