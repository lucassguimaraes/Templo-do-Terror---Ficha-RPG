
import React from 'react';
import { Attribute } from '../types';
import { Plus, Minus, Dice6 } from 'lucide-react';

interface StatBlockProps {
  label: string;
  value: Attribute;
  onUpdate: (field: 'current' | 'initial', delta: number) => void;
  extraAction?: React.ReactNode;
  onRoll?: () => void;
  visual?: React.ReactNode;
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value, onUpdate, extraAction, onRoll, visual }) => {
  return (
    <div className="relative bg-[#4a3728]/5 border-2 border-[#4a3728]/30 rounded-2xl p-4 parchment-shadow ink-stain overflow-hidden">
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center gap-3">
            <h2 
                className={`medieval-font text-2xl font-bold uppercase ${onRoll ? 'cursor-pointer hover:text-red-900 active:scale-95 transition-all' : ''}`}
                onClick={onRoll}
            >
                {label}
            </h2>
            {onRoll && <Dice6 size={14} className="opacity-30 animate-pulse" />}
        </div>
        
        <div className="flex flex-col items-end">
            <span className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">Inicial</span>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => onUpdate('initial', -1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#4a3728]/10 active:bg-[#4a3728]/30"
                >
                    <Minus size={10} />
                </button>
                <span className="text-lg font-bold min-w-[1ch] text-center">{value.initial}</span>
                <button 
                    onClick={() => onUpdate('initial', 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#4a3728]/10 active:bg-[#4a3728]/30"
                >
                    <Plus size={10} />
                </button>
            </div>
        </div>
      </div>
      
      <div className="bg-white/40 p-4 rounded-xl border border-[#4a3728]/10 shadow-inner flex items-center gap-4 relative z-10">
        {visual}
        <div className="flex-1 flex items-center justify-between">
            <button 
                onClick={() => onUpdate('current', -1)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4a3728] text-white active:scale-90 transition-transform shadow-lg"
            >
                <Minus size={24} />
            </button>
            
            <div className="text-center">
                <span className="text-4xl font-bold medieval-font leading-none">{value.current}</span>
                <p className="text-[10px] uppercase font-bold opacity-50 mt-1">Atual</p>
            </div>

            <button 
                onClick={() => onUpdate('current', 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4a3728] text-white active:scale-90 transition-transform shadow-lg"
            >
                <Plus size={24} />
            </button>
        </div>
      </div>
      {extraAction && <div className="mt-2 relative z-10">{extraAction}</div>}
    </div>
  );
};

export default StatBlock;
