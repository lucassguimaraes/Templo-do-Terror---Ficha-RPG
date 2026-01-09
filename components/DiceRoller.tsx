
import React, { useState } from 'react';
import { Dice6, X } from 'lucide-react';
import { playSound } from '../utils/sounds';

const DiceRoller: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<{ type: string; dice: number[] } | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const roll = (num: number) => {
    setIsRolling(true);
    setResult(null);
    playSound('dice');
    
    // Feedback tátil para Android
    if (window.navigator.vibrate) {
        window.navigator.vibrate([20, 10, 20]);
    }
    
    // Simulate animation delay
    setTimeout(() => {
      const newDice = Array.from({ length: num }, () => Math.floor(Math.random() * 6) + 1);
      setResult({ type: `${num}D6`, dice: newDice });
      setIsRolling(false);
      
      if (window.navigator.vibrate) {
          window.navigator.vibrate(40);
      }
    }, 400);
  };

  const close = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <>
      {/* Floating Button - Adjusted bottom position and z-index to clear the navigation bar */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-[#4a3728] text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-[60] border-4 border-[#f3e5ab]/30"
      >
        <Dice6 size={32} />
      </button>

      {/* Modal/Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#f3e5ab] w-full max-w-xs p-8 rounded-3xl border-4 border-[#4a3728] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <button onClick={close} className="absolute top-4 right-4 text-[#4a3728]">
              <X size={24} />
            </button>

            <h3 className="medieval-font text-2xl font-bold text-center mb-8 uppercase tracking-widest border-b border-[#4a3728]/20 pb-2">
              Lançar Dados
            </h3>

            <div className="flex flex-col gap-4 mb-8">
              <button 
                onClick={() => roll(1)}
                className="bg-[#4a3728] text-white p-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
              >
                1D6 (Sorte / Dano)
              </button>
              <button 
                onClick={() => roll(2)}
                className="bg-[#4a3728] text-white p-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
              >
                2D6 (Ataque)
              </button>
            </div>

            {/* Result Area */}
            <div className="h-24 flex items-center justify-center">
              {isRolling ? (
                <div className="animate-bounce">
                  <Dice6 size={48} className="text-[#4a3728] animate-spin" />
                </div>
              ) : result ? (
                <div className="text-center">
                  <div className="flex gap-4 justify-center items-center mb-2">
                    {result.dice.map((d, i) => (
                      <div key={i} className="w-12 h-12 bg-white border-2 border-[#4a3728] rounded-lg flex items-center justify-center text-3xl font-bold medieval-font">
                        {d}
                      </div>
                    ))}
                  </div>
                  <p className="font-bold text-xl uppercase medieval-font text-[#4a3728]">Total: {result.dice.reduce((a, b) => a + b, 0)}</p>
                </div>
              ) : (
                <p className="text-sm opacity-50 italic text-[#4a3728]">Selecione uma opção...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiceRoller;
