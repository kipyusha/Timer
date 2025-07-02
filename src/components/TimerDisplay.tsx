import { useEffect, useRef, useState } from "react";

const LOCAL_STORAGE_COUNT = "timerCount";

function TimerDisplay() {
  const [count, setCount] = useState<number>(() => {
    try {
      const storedCount = localStorage.getItem(LOCAL_STORAGE_COUNT);
      return storedCount ? parseInt(storedCount, 10) : 0;
    } catch (error) {
      console.log("Не удалось прочитать count из localStorage", error);
      return 0;
    }
  });
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const intervalIdRef = useRef<number | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());
  useEffect(() => {
    if (isRunning) {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }

      intervalIdRef.current = window.setInterval(() => {
        setCount((prevSeconds) => prevSeconds + 1);
      }, 1000);

      lastActivityTimeRef.current = Date.now();
    } else {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
  }, [isRunning]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_COUNT, count.toString());
    } catch (error) {
      console.log("Не удалось прочитать count из localStorage", error);
    }
  }, [count]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMin = String(minutes).padStart(2, "0");
    const formattedSec = String(seconds).padStart(2, "0");

    return `${formattedMin}:${formattedSec}`;
  };

  const handleStart = (): void => {
    setIsRunning(true);
  };

  const handleStop = (): void => {
    setIsRunning(false);
  };

  const handleReset = (): void => {
    setIsRunning(true);
    setCount(0);
    localStorage.removeItem(LOCAL_STORAGE_COUNT);
  };
  return (
    <div className="text-center">
      <h2 className="text-6xl font-bold">Таймер</h2>
      <p className="text-8xl mt-10">{formatTime(count)}</p>
      <div className="flex gap-4 justify-center mt-10 text-white">
        <button
          className="text-4xl bg-red-600 p-2 rounded-xl cursor-pointer hover:bg-red-500"
          onClick={handleStop}
        >
          Стоп
        </button>
        <button
          className="text-4xl bg-green-600 p-2 rounded-xl cursor-pointer hover:bg-green-500"
          onClick={handleStart}
        >
          Старт
        </button>
        <button
          className="text-4xl bg-blue-600 p-2 rounded-xl cursor-pointer hover:bg-blue-500"
          onClick={handleReset}
        >
          Рестарт
        </button>
      </div>
    </div>
  );
}

export default TimerDisplay;
