// Clear Board — shared types. Mirrors the SPEC content/profile schemas, now compile-checked.

export type Trust = 'verified' | 'needs-review' | 'operating-practice';
export type Source = 'CROR' | 'GOI' | 'SME' | 'derived';
export type Domain =
  | 'definitions' | 'signals' | 'switching' | 'securement'
  | 'radio' | 'authority' | 'operating' | 'protection';
export type ItemType = 'rule' | 'definition' | 'signal' | 'scenario' | 'radio-script';

export interface Citation {
  source: Source;
  ref: string | null;       // primary cite, e.g. "CROR 112(a)"
  relatedRef: string | null; // GOI anchored to a rule (D-0015)
  verbatim: string | null;   // exact CROR text (public document, D-0010)
  trust: Trust;
}

// Verified signal renderer spec — keys match the byte-for-byte drawSignal (type/plaque, not mount/plate).
export interface SignalAspect {
  heads: string[];                 // top→bottom lamp codes G/R/Y/L/D; 'f' suffix = flash THAT lamp
  type?: 'mast' | 'dwarf';
  plaque?: 'DV' | 'R' | 'L' | null;
  stagger?: boolean;
  flash?: boolean;
}

export interface ContentItem {
  id: string;
  domain: Domain;
  type: ItemType;
  title: string;
  plain: string;
  citation: Citation;
  payload: ({ aspects?: SignalAspect[] } & Record<string, unknown>) | null;
}

export interface Question {
  id: string;
  ruleId: string;
  domain: string;
  stem: string;
  choices: string[];
  answer: string;
  explain: string;
  tier?: number;
  trust?: string;
}

export interface Content {
  items: ContentItem[];
  byId: Record<string, ContentItem>;
  byDomain: Record<string, ContentItem[]>;
  questions: Question[];
  questionsByRule: Record<string, Question[]>;
}

// SM-2-lite per-item retention state (SPEC §Retention).
export interface SRState {
  fam: number; seen: number; correct: number;
  lastSeen: string | null; due: string; ease: number; interval: number;
}

export interface Settings {
  dys: boolean; contrast: boolean; reduce: boolean; audio: boolean; big: boolean;
}

export interface DomainState { mastery: number; lastDrill: string | null }

export interface Profile {
  schema: 1;
  createdAt: string; updatedAt: string;
  settings: Settings;
  items: Record<string, SRState>;
  domains: Record<string, DomainState>;
  yard: { completed: string[] };
  radio: { done: boolean };
  path: { stage: string; unlocked: string[]; testReady: boolean };
}

export interface DomainDef { id: Domain; name: string; desc: string; live: boolean }
