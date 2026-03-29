import { useEffect, useState } from 'react';

export default function useTimer(running: boolean): string {
  const [s, setS] = useState<number>(0);

  useEffect(() => {
    if (!running) {
      setS(0);
      return;
    }
    const id = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
