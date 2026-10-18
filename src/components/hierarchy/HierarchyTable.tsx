import { useState } from 'preact/hooks';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Segmented } from '../shared/Segmented';
import { CompactTable } from './CompactTable';
import { FullTable } from './FullTable';

type Layout = 'compact' | 'full';

/** Below this width the full table no longer fits and has to scroll sideways. */
const NARROW = '(max-width: 1100px)';

/**
 * The ranks and classes table. Wide screens get the full table. Narrow ones start on a compact
 * version that fits at a glance, with a toggle back to the full one.
 */
export function HierarchyTable() {
  const narrow = useMediaQuery(NARROW);
  const [layout, setLayout] = useState<Layout>('compact');
  const compact = narrow && layout === 'compact';

  return (
    <>
      {narrow && (
        <div className="hierarchy-table__toolbar">
          <Segmented<Layout>
            label="Table layout"
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'full', label: 'Full', title: 'With descriptions, scrolls sideways' },
            ]}
            value={layout}
            onChange={setLayout}
          />
        </div>
      )}
      <div className="hierarchy-table">{compact ? <CompactTable /> : <FullTable />}</div>
    </>
  );
}
