
import React from 'react';

interface HealthFlaskProps {
  current: number;
  initial: number;
}

const HealthFlask: React.FC<HealthFlaskProps> = ({ current, initial }) => {
  const percentage = Math.min(100, Math.max(0, (current / (initial || 1)) * 100));
  
  return (
    <div className="relative w-12 h-16 border-2 border-[#4a3728] rounded-b-2xl rounded-t-lg overflow-hidden bg-white/20 shadow-inner">
      {/* Liquid */}
      <div 
        className="flask-liquid absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-800 to-red-500"
        style={{ height: `${percentage}%` }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/30 animate-pulse"></div>
      </div>
      {/* Gloss Effect */}
      <div className="absolute top-1 left-1 w-2 h-4 bg-white/40 rounded-full blur-[1px]"></div>
    </div>
  );
};

export default HealthFlask;
