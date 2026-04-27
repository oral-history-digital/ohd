import { useMemo } from 'react';

import { buildProjectInstitutions } from '../utils';

/**
 * Returns the deduplicated, sorted list of institutions across all projects.
 */
export const useExplorerProjectInstitutions = ({ projects }) =>
    useMemo(() => buildProjectInstitutions(projects), [projects]);
