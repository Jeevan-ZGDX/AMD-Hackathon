"use client";

import { useEffect, useRef } from "react";

export default function PreCognitiveTracker({ onIntentPredicted }: { onIntentPredicted: (data: any) => void }) {
  const trackerRef = useRef({
    lastScrollY: 0,
    scrollSpeeds: [] as number[],
    hoverStart: 0,
    totalHoverDwell: 0,
    mousePositions: [] as {x: number, y: number}[]
  });

  useEffect(() => {
    // 1. Track Scroll Velocity
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const speed = Math.abs(currentScrollY - trackerRef.current.lastScrollY);
      trackerRef.current.scrollSpeeds.push(speed);
      if (trackerRef.current.scrollSpeeds.length > 20) trackerRef.current.scrollSpeeds.shift();
      trackerRef.current.lastScrollY = currentScrollY;
    };

    // 2. Track Hover Dwell
    const handleMouseMove = (e: MouseEvent) => {
      trackerRef.current.mousePositions.push({ x: e.clientX, y: e.clientY });
      if (trackerRef.current.mousePositions.length > 50) trackerRef.current.mousePositions.shift();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Periodically send data to backend
    const interval = setInterval(async () => {
      const speeds = trackerRef.current.scrollSpeeds;
      const avgScrollVelocity = speeds.length ? speeds.reduce((a,b)=>a+b,0)/speeds.length : 0;
      
      // Calculate jitter/tremor
      let tremor = 0;
      const pos = trackerRef.current.mousePositions;
      if (pos.length > 2) {
        for(let i=1; i<pos.length; i++) {
          tremor += Math.abs(pos[i].x - pos[i-1].x) + Math.abs(pos[i].y - pos[i-1].y);
        }
        tremor = tremor / pos.length;
      }

      // Simulate increasing hover dwell if mouse is still
      if (tremor < 5) {
        trackerRef.current.totalHoverDwell += 1000;
      }

      try {
        const res = await fetch("http://localhost:8000/api/v1/predict-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "user_123",
            scroll_velocity: avgScrollVelocity,
            hover_dwell_ms: trackerRef.current.totalHoverDwell,
            mouse_tremor: tremor
          })
        });
        const data = await res.json();
        onIntentPredicted(data);
      } catch(e) {
        // Backend not running, skip silently
      }

    }, 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [onIntentPredicted]);

  return null; // Invisible tracking component
}
