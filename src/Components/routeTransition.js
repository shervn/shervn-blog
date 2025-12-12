import { useLocation, Routes } from 'react-router-dom';
import { useEffect, useState, cloneElement, isValidElement } from 'react';

const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  // Clone Routes and pass displayLocation
  const childrenWithLocation = isValidElement(children) && children.type === Routes
    ? cloneElement(children, { location: displayLocation })
    : children;

  return (
    <div
      className={`route-transition route-transition-${transitionStage}`}
    >
      {childrenWithLocation}
    </div>
  );
};

export default RouteTransition;

