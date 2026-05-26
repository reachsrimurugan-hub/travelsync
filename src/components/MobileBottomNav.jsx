import { NavLink } from 'react-router-dom';
import { FiHome, FiCompass, FiCalendar, FiZap, FiUser } from 'react-icons/fi';
import { MOBILE_NAV } from '../utils/constants';

const icons = {
  home: FiHome,
  compass: FiCompass,
  calendar: FiCalendar,
  sparkles: FiZap,
  user: FiUser,
};

export const MobileBottomNav = () => (
  <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
    {MOBILE_NAV.map((item) => {
      const Icon = icons[item.icon];
      return (
        <NavLink key={item.path} to={item.path} end={item.path === '/'}>
          <Icon />
          <span>{item.label}</span>
        </NavLink>
      );
    })}
  </nav>
);
