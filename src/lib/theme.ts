/** localStorage key for the theme. The inline script in index.html reads the same key. */
const THEME_KEY = 'soulcore-theme';

/** The theme the inline script in index.html already applied. Dark is the default. */
export function initialDark(): boolean {
  return document.documentElement.getAttribute('data-theme') !== 'light';
}

export function applyTheme(dark: boolean): void {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  try {
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  } catch {
    // Not persisted, the theme still applies for this visit.
  }
}
