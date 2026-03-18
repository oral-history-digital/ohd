import { useMemo } from 'react';

import { buildArchiveYearRange } from '../utils';

/**
 * Returns the global min/max publication year across all archives.
 */
export const useExplorerYearRange = ({ archives }) =>
    useMemo(() => buildArchiveYearRange(archives), [archives]);
