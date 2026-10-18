import { SoulSea } from './soul-sea/SoulSea';

interface HeroProps {
  dark: boolean;
  onDarkChange(dark: boolean): void;
}

export function Hero({ dark, onDarkChange }: HeroProps) {
  return (
    <header className="hero">
      <div>
        <h1
          className={dark ? 'hero__title' : 'hero__title hero__title--nephis'}
          aria-label="Soul core hierarchy"
        >
          <span className="hero__title-line" aria-hidden="true">
            <span className="hero__title-text">
              S<i className="hero__sun" />
              ul core
            </span>
          </span>
          <span className="hero__title-line" aria-hidden="true">
            <span className="hero__title-text hero__title-text--hollow">hierarchy</span>
          </span>
        </h1>
        <p className="hero__lede">
          Seven ranks, walked in two directions. Rank is the quality of a soul core, class is how
          many cores burn inside.
        </p>
        <ul className="legend">
          <li className="legend__item">
            <i className="legend__swatch legend__swatch--corrupt" />
            Nightmare Creatures walk the path of corruption
          </li>
          <li className="legend__item">
            <i className="legend__swatch legend__swatch--ascend" />
            Awakened humans walk the path of ascension
          </li>
          <li className="legend__item">
            <i className="legend__swatch legend__swatch--core" />
            Soul cores, counted by class
          </li>
        </ul>
      </div>
      <SoulSea dark={dark} onDarkChange={onDarkChange} />
    </header>
  );
}
