import { useMemo } from 'react';

import { archivesData } from '../dummy-data/archives_data';
import { buildArchiveInstitutions } from '../utils';

/**
 * Returns the deduplicated, sorted list of institutions across all archives.
 */
export const useExplorerArchiveInstitutions = () =>
    useMemo(() => buildArchiveInstitutions(archivesData), []);
