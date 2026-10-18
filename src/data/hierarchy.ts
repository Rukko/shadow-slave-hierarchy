/**
 * Source data for the whole page. Every index is 0-based: rank 0 is Dormant, class 0 is Beast.
 * Edit the hierarchy here and every section follows.
 */

/** Which path a fighter walks: `m` for Nightmare Creatures, `h` for Awakened humans. */
export type Path = 'm' | 'h';

/** A point on one of the two power grids. */
export interface Fighter {
  p: Path;
  /** Rank index, 0..6. */
  r: number;
  /** Class index, 0..6. */
  k: number;
}

export interface Preset {
  label: string;
  a: Fighter;
  b: Fighter;
}

/** Creature ranks, the path of corruption. */
export const RANK_N = ['Dormant', 'Awakened', 'Fallen', 'Corrupted', 'Great', 'Cursed', 'Unholy'];
/** Human ranks, the path of ascension. */
export const RANK_H = [
  'Dormant',
  'Awakened',
  'Ascended',
  'Transcendent',
  'Supreme',
  'Sacred',
  'Divine',
];
/** Colloquial names humans use for each rank. */
export const COLLOQ = ['Sleeper', 'Awakened', 'Master', 'Saint', 'Sovereign', 'Spirit', 'God'];
/** Class is the number of soul cores (1..7). */
export const CLASS = ['Beast', 'Monster', 'Demon', 'Devil', 'Tyrant', 'Terror', 'Titan'];

/** What each human rank means, shown in the table next to its colloquial name. */
export const COLLOQ_DESC = [
  'Passed the First Nightmare. Gains an Aspect and a Flaw.',
  'Returned from the Dream Realm. Second Aspect Ability.',
  'Passed the Second Nightmare. Third Aspect Ability.',
  'Conquered the Third Nightmare. Demi-god level.',
  'Rules a Domain. Can bridge the two worlds.',
  'A lesser deity. No longer fully human.',
  'A true god, woven into the universal laws.',
];
/** What each creature class is like, shown in the table next to its name. */
export const CLASS_DESC = [
  'Dangerous and strong, but mindless.',
  'Devastating, with a warped, rudimentary intelligence.',
  'A semblance of intelligence. Can acquire abilities.',
  'Sentient and cunning, with powers akin to Aspect Abilities.',
  'Creates and commands armies of lesser minions.',
  'Spreads its influence over its surroundings.',
  'A colossal Calamity, a force of nature.',
];

/* Power points live in ./power-tables.ts. */

/** Ready-made battles offered under the matchup. */
export const PRESETS: Preset[] = [
  { label: 'Unholy Beast vs Dormant Titan', a: { p: 'm', r: 6, k: 0 }, b: { p: 'm', r: 0, k: 6 } },
  { label: 'Dormant Titan vs Fallen Tyrant', a: { p: 'm', r: 0, k: 6 }, b: { p: 'm', r: 2, k: 4 } },
  {
    label: 'Cursed Terror vs Unholy Monster',
    a: { p: 'm', r: 5, k: 5 },
    b: { p: 'm', r: 6, k: 1 },
  },
  {
    label: 'God vs Spirit, both with 7 cores',
    a: { p: 'h', r: 6, k: 6 },
    b: { p: 'h', r: 5, k: 6 },
  },
  {
    label: 'Spirit with 1 core vs Sovereign with 7 cores',
    a: { p: 'h', r: 5, k: 0 },
    b: { p: 'h', r: 4, k: 6 },
  },
];
