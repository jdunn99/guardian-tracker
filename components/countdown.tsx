"use client";

import React from "react";

interface CountdownProps {
  end: string;
}

export function Countdown({ end }: CountdownProps) {
  const calculateRemainingTime = React.useCallback(() => {
    const difference = new Date(end).getTime() - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        "day(s)": Math.floor(difference / (1000 * 60 * 60 * 24)),
        "hour(s)": Math.floor((difference / (1000 * 60 * 60)) % 24),
        "minute(s)": Math.floor((difference / 1000 / 60) % 60),
        "second(s)": Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [end]);

  const [timeLeft, setTimeLeft] = React.useState(calculateRemainingTime());

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateRemainingTime()), 1000;
    });

    return () => clearTimeout(timer);
  });

  return (
    <div>
      {Object.keys(timeLeft).map((interval) => {
        const value = timeLeft[interval as keyof typeof timeLeft];
        if (!value) {
          return null;
        }

        return (
          <span key={interval} className="text-white">
            {value} <span className="text-base text-slate-400">{interval}</span>{" "}
          </span>
        );
      })}
    </div>
  );
}
