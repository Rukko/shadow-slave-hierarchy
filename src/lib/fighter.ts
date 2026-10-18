import { CLASS, COLLOQ, RANK_H, RANK_N, type Fighter } from '../data/hierarchy';

/** "1 core", "3 cores" for a 0-based class index. */
export function coreCount(k: number): string {
  return k + 1 + (k ? ' cores' : ' core');
}

/** Display name, e.g. "Dormant Beast" or "Saint Devil (4 cores)". */
export function fighterName(x: Fighter): string {
  return x.p === 'm'
    ? RANK_N[x.r] + ' ' + CLASS[x.k]
    : COLLOQ[x.r] + ' ' + CLASS[x.k] + ' (' + coreCount(x.k) + ')';
}

/** Secondary line under the name, spelling out rank and class. */
export function fighterSub(x: Fighter): string {
  return x.p === 'm'
    ? 'Nightmare Creature · rank ' + (x.r + 1) + ', class ' + (x.k + 1)
    : 'Awakened · ' + RANK_H[x.r] + ' rank, ' + coreCount(x.k);
}

/** Indefinite article for a name. */
export function article(name: string): string {
  return /^[AEIOU]/i.test(name) ? 'an ' : 'a ';
}
