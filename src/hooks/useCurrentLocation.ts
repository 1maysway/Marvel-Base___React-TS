import { useState, useEffect } from 'react';

const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(window.location);

  useEffect(() => {
    const updateCurrentURL = () => {setCurrentLocation(window.location)
    console.log('UPDATE !!!')};

    window.addEventListener('popstate', updateCurrentURL);

    return () => window.removeEventListener('popstate', updateCurrentURL);
  }, []);

  return currentLocation;
};

export default useCurrentLocation;