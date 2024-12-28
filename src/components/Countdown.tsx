import { FC, useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";

interface CountdownProps {
  durationLeftInSeconds: number;
  totalDurationInSeconds: number;
  onTimeout: () => void;
}

export const Countdown: FC<CountdownProps> = ({
  durationLeftInSeconds,
  totalDurationInSeconds,
  onTimeout,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationLeftInSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const progress = useMemo(() => {
    return (timeLeft / totalDurationInSeconds) * 100;
  }, [timeLeft, totalDurationInSeconds]);

  const isWarning = useMemo(() => {
    return timeLeft <= 10;
  }, [timeLeft]);

  const strokeColor = isWarning ? "stroke-red-500" : "stroke-blue-500";
  const radius = 40;
  const circumference = useMemo(() => {
    return 2 * Math.PI * radius;
  }, [radius]);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }, [timeLeft]);

  return (
    <Card className='relative z-30 inline-block p-4'>
      <div className='relative flex items-center justify-center'>
        <svg className='w-48 h-48' viewBox='0 0 100 100'>
          <circle
            className='text-gray-200 stroke-current'
            strokeWidth='3'
            cx='50'
            cy='50'
            r={radius}
            fill='transparent'
            strokeLinecap='round'
          />
          <circle
            className={`${strokeColor} transition-all duration-1000 ease-in-out`}
            strokeWidth='3'
            strokeLinecap='round'
            cx='50'
            cy='50'
            r={radius}
            fill='transparent'
            strokeDasharray={circumference}
            strokeDashoffset={((100 - progress) / 100) * circumference}
          />
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>
          <span
            className={`text-2xl font-bold ${
              isWarning ? "text-red-500" : "text-blue-500"
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </Card>
  );
};
