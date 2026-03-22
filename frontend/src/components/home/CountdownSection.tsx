"use client";

import { useEffect, useState } from "react";

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <div className="relative w-full">
        <div className="absolute inset-0 bg-[#e63946]/20 blur-xl rounded-lg" />
        <div className="relative bg-[#0d0d0d] border border-[#e63946]/40 rounded-lg aspect-square flex items-center justify-center overflow-hidden w-full">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/60 to-transparent" />
          <span className="font-bebas text-[clamp(1.5rem,8vw,3.5rem)] text-white tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-[9px] sm:text-[10px] text-[#e63946]/70 mt-2 tracking-widest font-medium uppercase truncate w-full text-center">
        {label}
      </span>
    </div>
  );
}

export function CountdownSection() {
  const velada6Date = new Date("2026-07-25T20:00:00");
  const { days, hours, minutes, seconds } = useCountdown(velada6Date);

  return (
    <div className="flex items-end gap-2 sm:gap-3 w-full max-w-sm mx-auto mb-14">
      <CountdownUnit value={days} label="DÍAS" />
      <div className="font-bebas text-2xl sm:text-4xl text-[#e63946]/40 pb-6 flex-shrink-0">
        :
      </div>
      <CountdownUnit value={hours} label="HORAS" />
      <div className="font-bebas text-2xl sm:text-4xl text-[#e63946]/40 pb-6 flex-shrink-0">
        :
      </div>
      <CountdownUnit value={minutes} label="MIN" />
      <div className="font-bebas text-2xl sm:text-4xl text-[#e63946]/40 pb-6 flex-shrink-0">
        :
      </div>
      <CountdownUnit value={seconds} label="SEG" />
    </div>
  );
}
