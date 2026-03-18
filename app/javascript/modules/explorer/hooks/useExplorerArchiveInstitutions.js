import { useMemo } from 'react';

import { buildArchiveInstitutions } from '../utils';

/**
 * Returns the deduplicated, sorted list of institutions across all archives.
 */
export const useExplorerArchiveInstitutions = ({ archives }) =>
    useMemo(() => buildArchiveInstitutions(archives), [archives]);
