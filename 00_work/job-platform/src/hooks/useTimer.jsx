import { formatTime } from '@/utils/helpers';
import { useEffect, useRef, useState } from 'react';
// import { formatTime } from '@/utils/helper';

export default function useTimer({ initialTime, onFinish, isRunning }) {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    setCurrentTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentTime((time) => {
          if (time === 0) {
            clearInterval(timerRef.current);
            if (typeof onFinish === 'function') {
              setCurrentTime(initialTime);
              onFinish();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  return formatTime(currentTime);
}
