export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  title?: string;
}

interface SegmentedProps<T extends string> {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange(value: T): void;
}

/** Pill-shaped toggle group: one option pressed at a time. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="segmented__option"
          aria-pressed={o.value === value}
          title={o.title}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
