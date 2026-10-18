import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { CLASS, RANK_H, RANK_N } from '../../data/hierarchy';
import { Segmented } from '../shared/Segmented';
import { createSeaRenderer, type SeaRenderer } from './renderer';

const RANKS = [7, 6, 5, 4, 3, 2, 1];
const CORES = [1, 2, 3, 4, 5, 6, 7];

interface SoulSeaProps {
  dark: boolean;
  onDarkChange(dark: boolean): void;
}

/**
 * The hero figure: a canvas on XY axes. Rank sets how high and bright the suns burn, cores set
 * how many. Its Nephis / Sunny toggle is also the page theme switch.
 */
export function SoulSea({ dark, onDarkChange }: SoulSeaProps) {
  const [rank, setRank] = useState(5);
  const [cores, setCores] = useState(7);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SeaRenderer | null>(null);

  // Layout effects, so a theme swap repaints the canvas before the view transition captures it.
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const r = createSeaRenderer(canvasRef.current, { rank: 5, cores: 7, dark: true });
    rendererRef.current = r;
    return () => r.destroy();
  }, []);
  useLayoutEffect(() => {
    rendererRef.current?.set({ rank, cores, dark });
  }, [rank, cores, dark]);

  const coreWord = (n: number) => (n === 1 ? ' core' : ' cores');

  return (
    <figure className="soul-sea">
      <div className="soul-sea__toolbar">
        <Segmented
          label="Theme: Nephis is light, Sunny is dark"
          options={[
            { value: 'nephis', label: 'Nephis', title: 'Light theme' },
            { value: 'sunny', label: 'Sunny', title: 'Dark theme' },
          ]}
          value={dark ? 'sunny' : 'nephis'}
          onChange={(v) => onDarkChange(v === 'sunny')}
        />
      </div>
      <div className="soul-sea__plot">
        <div className="soul-sea__y-axis">
          <span className="soul-sea__y-title">
            Rank
            <br />↑
          </span>
          <div className="soul-sea__ranks" role="group" aria-label="Rank">
            {RANKS.map((i) => (
              <button
                key={i}
                type="button"
                className="soul-sea__pick soul-sea__pick--rank"
                aria-pressed={i === rank}
                title={'Rank ' + i + ': ' + RANK_N[i - 1] + ' / ' + RANK_H[i - 1]}
                onClick={() => setRank(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="soul-sea__frame">
          <canvas
            ref={canvasRef}
            className="soul-sea__canvas"
            role="img"
            aria-label={
              'A Soul Sea with ' +
              cores +
              ' ' +
              (dark ? 'black ' : '') +
              (cores === 1 ? 'sun' : 'suns') +
              ' burning at rank ' +
              rank +
              '.'
            }
          />
        </div>
        <span className="soul-sea__x-title">Cores →</span>
        <div className="soul-sea__cores" role="group" aria-label="Soul cores">
          {CORES.map((i) => (
            <button
              key={i}
              type="button"
              className="soul-sea__pick soul-sea__pick--core"
              aria-pressed={i === cores}
              title={i + coreWord(i) + ': ' + CLASS[i - 1]}
              onClick={() => setCores(i)}
            >
              <b className="soul-sea__pick-count">{i}</b>
              <small className="soul-sea__pick-label">{CLASS[i - 1]}</small>
            </button>
          ))}
        </div>
      </div>
      <p className="soul-sea__readout" aria-live="polite">
        {'Rank ' + rank + ' · ' + RANK_N[rank - 1] + ' / ' + RANK_H[rank - 1]}
        {'  ·  ' + cores + coreWord(cores) + ' · ' + CLASS[cores - 1]}
      </p>
      <figcaption className="soul-sea__caption">
        In the Soul Sea every soul core hangs in the sky as a sun. Pick the cores to set how many
        suns burn, and the rank to set how high and bright they rise.
      </figcaption>
    </figure>
  );
}
