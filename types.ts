
export interface Attribute {
  current: number;
  initial: number;
}

export interface Monster {
  id: string;
  name: string;
  skill: number;
  stamina: number;
}

export interface Spell {
  id: string;
  name: string;
  used: boolean;
}

export interface GameState {
  skill: Attribute;
  stamina: Attribute;
  luck: Attribute;
  equipment: string;
  gold: string;
  spellsList: Spell[];
  provisions: number;
  monsters: Monster[];
  notes: string;
  currentParagraph: string;
}

export const INITIAL_STATE: GameState = {
  skill: { current: 0, initial: 0 },
  stamina: { current: 0, initial: 0 },
  luck: { current: 0, initial: 0 },
  equipment: "",
  gold: "0",
  spellsList: [],
  provisions: 10,
  monsters: [],
  notes: "",
  currentParagraph: ""
};
