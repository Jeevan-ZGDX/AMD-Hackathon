"use client";

import { useEffect, useState } from "react";

export default function Heatmap() {
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Initial dummy data to render before WS connects
    const initial = ["MUM", "DEL", "BLR", "CHE", "HYD"].map(city => ({
      city,
      data: Array(7).fill(0).map(() => Math.random() * 0.5 + 0.1)
    }));
    setHeatmapData(initial);

    // Connect WebSocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/heatmap";
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "heatmap_update") {
        setHeatmapData(msg.payload);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
        <div className="font-mono text-base text-gray-300 font-semibold">SKU Category: Athleisure</div>
        <div className="font-mono text-sm text-accent2 flex items-center gap-3 font-bold">
          <div className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
          Updated {lastUpdated || "..."}
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col gap-1 pr-6 pt-8 justify-between">
          {heatmapData.map((row, i) => (
            <div key={i} className="font-mono text-sm text-gray-400 font-bold h-12 flex items-center">{row.city}</div>
          ))}
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-2 mb-3">
            {days.map(d => (
              <div key={d} className="font-mono text-xs text-center text-gray-400 font-bold uppercase">{d}</div>
            ))}
          </div>
          
          <div className="flex flex-col gap-1">
            {heatmapData.map((row, i) => (
              <div key={i} className="grid grid-cols-7 gap-2">
                {row.data.map((val: number, j: number) => {
                  const r = Math.round(255 * Math.min(1, val * 1.3));
                  const g = Math.round(214 * (1 - val));
                  return (
                    <div 
                      key={j} 
                      className="h-12 rounded-lg hover:scale-105 transition-all shadow-sm cursor-crosshair relative group flex items-center justify-center font-mono text-xs font-bold text-white/80"
                      style={{ backgroundColor: `rgba(${r},${g},0,${0.15 + val * 0.8})` }}
                    >
                      {val.toFixed(2)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-10">
        <div className="font-mono text-sm text-gray-400 font-semibold">Low Demand</div>
        <div className="flex-1 h-2.5 rounded-full bg-gradient-to-r from-yellow/20 to-accent/90 shadow-inner" />
        <div className="font-mono text-sm text-gray-400 font-semibold">Peak Demand</div>
      </div>
    </div>
  );
}
