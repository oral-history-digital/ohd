import { useMemo } from 'react';

import { archivesData } from '../dummy-data/archives_data';
import { buildArchiveYearRange } from '../utils';

/**
 * Returns the global min/max publication year across all archives.
 */
export const useExplorerYearRange = () =>
    useMemo(() => buildArchiveYearRange(archivesData), []);
