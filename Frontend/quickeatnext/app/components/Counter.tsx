"use client";
import { useEffect, useState } from "react";

export const Counter = ({ targetValue }: { targetValue: any }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const increment = Math.max(1, Math.floor(targetValue / 100));
    console.log(increment); // Increment by 1% of the target value
    const timer = setInterval(() => {
      setCount((prevCount) => {
        const nextCount = Math.min(prevCount + increment, targetValue);
        return nextCount;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [targetValue]);

  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
