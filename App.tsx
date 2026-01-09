
import React, { useState, useEffect } from 'react';
import { GameState, INITIAL_STATE, Monster, Attribute, Spell } from './types';
import StatBlock from './components/StatBlock';
import MonsterCard from './components/MonsterCard';
import DiceRoller from './components/DiceRoller';
import HealthFlask from './components/HealthFlask';
import { 
    Plus, Minus, Sword, Backpack, Coins, 
    Scroll, Wand2, Clover, User, FileText, 
    Skull, Dice6, RotateCcw, Utensils, BookOpen, Map
} from 'lucide-react';
import { playSound } from './utils/sounds';

type TabType = 'hero' | 'items' | 'combat';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('templo-terror-save');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.spellsList) parsed.spellsList = [];
        if (parsed.notes === undefined) parsed.notes = "";
        if (parsed.currentParagraph === undefined) parsed.currentParagraph = "";
        return parsed;
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [newMonsterName, setNewMonsterName] = useState("");
  const [newSpellName, setNewSpellName] = useState("");
  const [luckTestResult, setLuckTestResult] = useState<{ roll: number; success: boolean; total?: number } | null>(null);

  // Health Effect
  useEffect(() => {
    const vignette = document.getElementById('vignette');
    if (vignette) {
      if (state.stamina.current < 5 && state.stamina.current > 0) {
        vignette.classList.add('vignette-active');
      } else {
        vignette.classList.remove('vignette-active');
      }
    }
  }, [state.stamina.current]);

  useEffect(() => {
    localStorage.setItem('templo-terror-save', JSON.stringify(state));
  }, [state]);

  const updateAttribute = (attr: keyof Pick<GameState, 'skill' | 'stamina' | 'luck'>, field: keyof Attribute, delta: number) => {
    setState(prev => ({
      ...prev,
      [attr]: {
        ...prev[attr],
        [field]: Math.max(0, prev[attr][field] + delta)
      }
    }));
    playSound('write');
  };

  const updateText = (field: keyof GameState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
    if (field === 'gold') playSound('gold');
    else playSound('write');
  };

  const eatProvision = () => {
    if (state.provisions <= 0) return;
    
    setState(prev => {
        const newStamina = Math.min(prev.stamina.initial, prev.stamina.current + 4);
        return {
            ...prev,
            provisions: prev.provisions - 1,
            stamina: { ...prev.stamina, current: newStamina }
        };
    });
    playSound('luck');
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const rollAttack = () => {
    const roll = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
    const total = roll + state.skill.current;
    setLuckTestResult({ roll, success: true, total }); 
    playSound('dice');
    if (window.navigator.vibrate) window.navigator.vibrate([30, 10, 30]);
    setTimeout(() => setLuckTestResult(null), 4000);
  };

  const testLuck = () => {
    const roll = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
    const success = roll <= state.luck.current;
    setLuckTestResult({ roll, success });
    playSound('luck');
    if (window.navigator.vibrate) window.navigator.vibrate(success ? 50 : 200);
    updateAttribute('luck', 'current', -1);
    setTimeout(() => setLuckTestResult(null), 3000);
  };

  const addMonster = () => {
    if (!newMonsterName.trim()) return;
    const newMonster: Monster = {
      id: Date.now().toString(),
      name: newMonsterName,
      skill: 0,
      stamina: 0
    };
    setState(prev => ({ ...prev, monsters: [...prev.monsters, newMonster] }));
    setNewMonsterName("");
    playSound('write');
  };

  const addSpell = () => {
    if (!newSpellName.trim()) return;
    const newSpell: Spell = {
        id: Date.now().toString(),
        name: newSpellName,
        used: false
    };
    setState(prev => ({ ...prev, spellsList: [...prev.spellsList, newSpell] }));
    setNewSpellName("");
    playSound('write');
  };

  const toggleSpell = (id: string) => {
    setState(prev => ({
        ...prev,
        spellsList: prev.spellsList.map(s => s.id === id ? { ...s, used: !s.used } : s)
    }));
    playSound('write');
  };

  const removeSpell = (id: string) => {
    setState(prev => ({
        ...prev,
        spellsList: prev.spellsList.filter(s => s.id !== id)
    }));
    playSound('delete');
  };

  const updateMonster = (id: string, field: keyof Monster, value: any) => {
    setState(prev => ({
      ...prev,
      monsters: prev.monsters.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
    playSound('write');
  };

  const removeMonster = (id: string) => {
    setState(prev => ({
      ...prev,
      monsters: prev.monsters.filter(m => m.id !== id)
    }));
    playSound('delete');
  };

  const resetGame = () => {
    if (confirm("Deseja realmente reiniciar a ficha?")) {
      setState(INITIAL_STATE);
      localStorage.removeItem('templo-terror-save');
      playSound('delete');
    }
  };

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    playSound('write');
  };

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto scroll-container relative">
      {/* Overlay Feedback */}
      {luckTestResult && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] pointer-events-none">
            <div className="bg-[#4a3728] text-[#f3e5ab] px-8 py-6 rounded-3xl shadow-2xl medieval-font text-2xl animate-bounce border-4 border-[#f3e5ab] flex flex-col items-center">
              {luckTestResult.total !== undefined ? (
                  <>
                    <span className="text-sm opacity-60">FORÇA DE ATAQUE</span>
                    <span className="text-5xl font-bold">{luckTestResult.total}</span>
                    <span className="text-xs mt-2 italic">({luckTestResult.roll} nos dados + {state.skill.current})</span>
                  </>
              ) : (
                  <>
                    <span className="text-4xl">{luckTestResult.success ? "🍀 SUCESSO!" : "💀 FALHA!"}</span>
                    <span className="text-lg opacity-70 mt-2">Rolou {luckTestResult.roll}</span>
                  </>
              )}
            </div>
        </div>
      )}

      {/* Content Header */}
      <header className="text-center p-6 border-b-2 border-[#4a3728]/10 bg-white/10 backdrop-blur-sm sticky top-0 z-40">
        <h1 className="medieval-font text-3xl font-bold uppercase tracking-widest text-[#2d1e12]">
          O Templo do Terror
        </h1>
        <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-[#4a3728]/5 px-3 py-1 rounded-full">
                <Map size={12} className="opacity-50" />
                <span className="text-[10px] uppercase font-bold opacity-70">Parágrafo: </span>
                <input 
                    type="text" 
                    className="w-12 text-[10px] font-bold border-none p-0 focus:ring-0 text-[#2d1e12]" 
                    placeholder="???"
                    value={state.currentParagraph}
                    onChange={(e) => updateText('currentParagraph', e.target.value)}
                />
            </div>
            <button onClick={resetGame} className="text-red-900/50 hover:text-red-900"><RotateCcw size={14} /></button>
        </div>
      </header>

      {/* Main Tabbed Content */}
      <main className="p-4 pt-6 tab-content">
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <StatBlock 
              label="Habilidade" 
              value={state.skill} 
              onUpdate={(field, delta) => updateAttribute('skill', field, delta)} 
              onRoll={rollAttack}
            />
            <StatBlock 
              label="Energia" 
              value={state.stamina} 
              onUpdate={(field, delta) => updateAttribute('stamina', field, delta)} 
              visual={<HealthFlask current={state.stamina.current} initial={state.stamina.initial} />}
            />
            <StatBlock 
              label="Sorte" 
              value={state.luck} 
              onUpdate={(field, delta) => updateAttribute('luck', field, delta)} 
              onRoll={testLuck}
              extraAction={
                <button 
                    onClick={testLuck}
                    className="w-full py-2 bg-[#4a3728] text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase active:scale-95 transition-transform"
                >
                    <Clover size={14} /> Testar Sorte
                </button>
              }
            />

            <Section icon={<Wand2 className="w-5 h-5" />} title="Magias Memorizadas">
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scroll-container">
                    {state.spellsList.length === 0 && <p className="text-[10px] italic opacity-50 text-center py-2">Nenhuma magia ativa.</p>}
                    {state.spellsList.map(spell => (
                        <div key={spell.id} className="flex items-center gap-2 bg-white/40 p-2 rounded-lg border border-[#4a3728]/10 group">
                            <input 
                                type="checkbox" 
                                checked={spell.used} 
                                onChange={() => toggleSpell(spell.id)}
                                className="w-5 h-5 rounded-full border-[#4a3728] text-[#4a3728] focus:ring-[#4a3728]"
                            />
                            <span className={`flex-1 text-sm font-bold ${spell.used ? 'strike-through' : ''}`}>
                                {spell.name}
                            </span>
                            <button onClick={() => removeSpell(spell.id)} className="p-1 text-red-800">
                                <Minus size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        className="flex-1 p-2 border-[#4a3728]/30 rounded-lg text-xs"
                        placeholder="Adicionar Magia..."
                        value={newSpellName}
                        onChange={(e) => setNewSpellName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSpell()}
                    />
                    <button onClick={addSpell} className="bg-[#4a3728] text-white px-3 py-2 rounded-lg text-xs">
                        Add
                    </button>
                </div>
            </Section>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            <Section icon={<Backpack className="w-5 h-5" />} title="Mochila e Equipamentos">
              <textarea 
                className="w-full h-48 p-3 rounded-xl border-[#4a3728]/30 focus:border-[#4a3728] focus:ring-0 resize-none text-sm leading-relaxed"
                placeholder="Armas, elixires, chaves e pergaminhos encontrados..."
                value={state.equipment}
                onChange={(e) => updateText('equipment', e.target.value)}
              />
            </Section>

            <div className="grid grid-cols-2 gap-4">
              <Section icon={<Coins className="w-5 h-5" />} title="Ouro">
                <div className="text-center py-4 bg-yellow-500/10 rounded-xl border border-yellow-800/20">
                    <input 
                    type="text" 
                    className="w-full text-center text-4xl font-bold border-none p-0 focus:ring-0"
                    value={state.gold}
                    onChange={(e) => updateText('gold', e.target.value)}
                    />
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Peças de Ouro</p>
                </div>
              </Section>
              <Section icon={<FileText className="w-5 h-5" />} title="Provisões">
                <div className="flex items-center justify-between p-1">
                  <button onClick={() => updateText('provisions', Math.max(0, state.provisions - 1))} className="p-2 bg-red-900/10 text-red-900 rounded-full">
                    <Minus size={16} />
                  </button>
                  <span className="text-3xl font-bold medieval-font">{state.provisions}</span>
                  <button onClick={() => updateText('provisions', state.provisions + 1)} className="p-2 bg-[#4a3728]/10 text-[#4a3728] rounded-full">
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                    onClick={eatProvision}
                    disabled={state.provisions <= 0}
                    className="mt-3 w-full py-2 bg-green-800 text-white rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold uppercase disabled:opacity-30 active:scale-95 transition-all shadow-md"
                >
                    <Utensils size={12} /> Comer (+4 Energia)
                </button>
              </Section>
            </div>
          </div>
        )}

        {activeTab === 'combat' && (
          <div className="space-y-6">
            <Section icon={<BookOpen className="w-5 h-5" />} title="Notas e Diário">
              <textarea 
                className="w-full h-32 p-3 rounded-xl border-[#4a3728]/30 focus:border-[#4a3728] focus:ring-0 resize-none text-sm leading-relaxed"
                placeholder="Anotações sobre enigmas, códigos e direções..."
                value={state.notes}
                onChange={(e) => updateText('notes', e.target.value)}
              />
            </Section>

            <Section icon={<Skull className="w-5 h-5" />} title="Bestiário do Templo">
              <div className="space-y-4 mb-6">
                {state.monsters.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-[#4a3728]/20 rounded-2xl">
                        <p className="opacity-40 italic text-sm">Nenhum encontro registrado...</p>
                    </div>
                )}
                {state.monsters.map(monster => (
                  <MonsterCard 
                    key={monster.id} 
                    monster={monster} 
                    onUpdate={(field, value) => updateMonster(monster.id, field, value)}
                    onRemove={() => removeMonster(monster.id)}
                  />
                ))}
              </div>
              
              <div className="bg-[#4a3728]/5 p-4 rounded-2xl border-2 border-[#4a3728]/10">
                <h4 className="text-xs font-bold uppercase mb-3 opacity-60">Registrar Novo Monstro</h4>
                <div className="flex gap-2">
                    <input 
                    type="text" 
                    className="flex-1 p-3 border-[#4a3728]/30 rounded-xl text-sm bg-white/40"
                    placeholder="Nome da Criatura..."
                    value={newMonsterName}
                    onChange={(e) => setNewMonsterName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMonster()}
                    />
                    <button 
                    onClick={addMonster}
                    className="bg-[#4a3728] text-white px-6 py-3 rounded-xl active:scale-95 transition-transform"
                    >
                    <Plus />
                    </button>
                </div>
              </div>
            </Section>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#4a3728] text-[#f3e5ab] flex items-center justify-around z-50 border-t-4 border-[#f3e5ab]/20 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
        <NavBtn 
            active={activeTab === 'hero'} 
            onClick={() => changeTab('hero')} 
            icon={<User />} 
            label="HERÓI" 
        />
        <NavBtn 
            active={activeTab === 'items'} 
            onClick={() => changeTab('items')} 
            icon={<Backpack />} 
            label="ITENS" 
        />
        <NavBtn 
            active={activeTab === 'combat'} 
            onClick={() => changeTab('combat')} 
            icon={<Sword />} 
            label="COMBATE" 
        />
      </nav>

      <DiceRoller />
    </div>
  );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white/40 parchment-shadow rounded-2xl border-2 border-[#4a3728]/10 overflow-hidden ink-stain">
    <div className="bg-[#4a3728]/5 px-4 py-3 border-b border-[#4a3728]/5 flex items-center gap-3">
      <span className="opacity-40">{icon}</span>
      <h3 className="medieval-font font-bold uppercase text-sm tracking-wider">{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const NavBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'scale-110 text-white' : 'opacity-50'}`}
  >
    <div className={`p-2 rounded-xl ${active ? 'bg-white/10' : ''}`}>
        {icon}
    </div>
    <span className="text-[10px] font-bold tracking-widest medieval-font">{label}</span>
  </button>
);

export default App;
