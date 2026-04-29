import { useMemo } from 'react';

import { buildProjectYearRange } from '../utils';

/**
 * Returns the global min/max publication year across all projects.
 */
export const useExplorerYearRange = ({ projects }) =>
    useMemo(() => buildProjectYearRange(projects), [projects]);
