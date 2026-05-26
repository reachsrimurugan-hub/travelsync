import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { DestinationCard } from './DestinationCard';
import { GridSkeleton } from './LoadingSkeleton';

export const PlaceCarousel = ({ title, subtitle, places, loading, onViewDetails, viewAllLink }) => {
  if (loading) return <GridSkeleton count={3} />;

  return (
    <section className="section swiper-section">
      <div className="container">
        <div className="carousel-header">
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          {viewAllLink && <Link to={viewAllLink}>View all →</Link>}
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.15}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          breakpoints={{
            576: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {(places || []).map((place, i) => (
            <SwiperSlide key={place.id}>
              <DestinationCard place={place} onViewDetails={onViewDetails} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
