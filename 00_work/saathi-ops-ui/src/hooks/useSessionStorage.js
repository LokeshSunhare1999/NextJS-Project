import { useState, useEffect } from 'react';

// Custom hook to manage session storage
function useSessionStorage(key, initialValue) {
  // Retrieve stored value from session storage
  const getStoredValue = () => {
    const storedValue = sessionStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error parsing session storage value', error);
      return initialValue;
    }
  };

  // useState with the stored value
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // useEffect to update session storage when storedValue changes
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error setting session storage value', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useSessionStorage;
