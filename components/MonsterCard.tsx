
import React from 'react';
import { Monster } from '../types';
import { Trash2, Heart, Shield, Skull } from 'lucide-react';

interface MonsterCardProps {
  monster: Monster;
  onUpdate: (field: keyof Monster, value: any) => void;
  onRemove: () => void;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onUpdate, onRemove }) => {
  return (
    <div className="bg-white/80 p-5 rounded-2xl border-2 border-[#4a3728]/30 shadow-md relative group ink-stain overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-900/20"></div>
      
      <button 
        onClick={onRemove}
        className="absolute top-3 right-3 text-red-900/30 hover:text-red-900 transition-colors p-1"
      >
        <Trash2 size={16} />
      </button>

      <div className="mb-4 flex items-center gap-2">
        <Skull size={18} className="opacity-40" />
        <input 
          type="text" 
          className="w-full font-bold medieval-font border-none border-b-2 border-transparent focus:border-[#4a3728]/20 bg-transparent p-0 text-xl uppercase tracking-tighter focus:ring-0"
          value={monster.name}
          onChange={(e) => onUpdate('name', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="bg-[#4a3728]/5 p-3 rounded-xl border border-[#4a3728]/10">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
            <Shield size={14} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Habilidade</p>
          </div>
          <div className="flex items-center justify-around">
            <button onClick={() => onUpdate('skill', Math.max(0, monster.skill - 1))} className="text-xl font-bold opacity-30 hover:opacity-100">−</button>
            <span className="text-3xl font-bold medieval-font">{monster.skill}</span>
            <button onClick={() => onUpdate('skill', monster.skill + 1)} className="text-xl font-bold opacity-30 hover:opacity-100">+</button>
          </div>
        </div>

        <div className="bg-red-900/5 p-3 rounded-xl border border-red-900/10">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
            <Heart size={14} className="text-red-900" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-900">Energia</p>
          </div>
          <div className="flex items-center justify-around">
            <button onClick={() => onUpdate('stamina', Math.max(0, monster.stamina - 1))} className="text-xl font-bold text-red-900/30 hover:text-red-900">−</button>
            <span className="text-3xl font-bold medieval-font text-red-900">{monster.stamina}</span>
            <button onClick={() => onUpdate('stamina', monster.stamina + 1)} className="text-xl font-bold text-red-900/30 hover:text-red-900">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonsterCard;
