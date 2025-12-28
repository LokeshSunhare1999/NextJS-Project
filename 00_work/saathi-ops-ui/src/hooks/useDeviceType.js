import { useState, useEffect } from 'react';
import { DEVICE_TYPES } from '../constants';

function useDeviceType() {
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES?.DESKTOP);

  useEffect(() => {
    const updateDeviceType = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const isTablet = window.matchMedia(
        '(min-width: 769px) and (max-width: 1024px)',
      ).matches;

      if (isMobile) setDeviceType(DEVICE_TYPES?.MOBILE);
      else if (isTablet) setDeviceType(DEVICE_TYPES?.TABLET);
      else setDeviceType(DEVICE_TYPES?.DESKTOP);
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return deviceType;
}

export default useDeviceType;
