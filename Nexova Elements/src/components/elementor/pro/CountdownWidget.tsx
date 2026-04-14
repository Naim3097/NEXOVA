"use client";

import React, { useState, useEffect } from "react";

interface CountdownWidgetProps {
  dueDate?: string;
  view?: "block" | "inline";
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  expiredMessage?: string;
}

export default function CountdownWidget({
  dueDate = "2025-12-31",
  view = "block",
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  expiredMessage = "Offer Expired",
}: CountdownWidgetProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(dueDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [dueDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days, show: showDays },
    { label: "Hours", value: timeLeft.hours, show: showHours },
    { label: "Minutes", value: timeLeft.minutes, show: showMinutes },
    { label: "Seconds", value: timeLeft.seconds, show: showSeconds },
  ];

  if (isExpired) {
    return (
      <div className="w-full p-6 bg-gray-100 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-500">{expiredMessage}</h3>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap ${view === "inline" ? "gap-4 items-center" : "gap-4 justify-center"}`}>
      {timeUnits.filter(u => u.show).map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className={`bg-blue-600 text-white rounded p-4 text-center flex flex-col justify-center ${view === "block" ? "min-w-[100px] aspect-square" : "px-6 py-3"}`}>
            <div className={`${view === "block" ? "text-4xl" : "text-2xl"} font-bold leading-none mb-1`}>
              {unit.value < 10 ? `0${unit.value}` : unit.value}
            </div>
            <div className="text-xs uppercase tracking-wider opacity-80">{unit.label}</div>
          </div>
          {view === "inline" && index < timeUnits.filter(u => u.show).length - 1 && (
            <span className="text-2xl font-bold text-gray-300">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
