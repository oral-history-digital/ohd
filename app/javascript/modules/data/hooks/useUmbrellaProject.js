import { useSelector } from 'react-redux';

import { getUmbrellaProject } from '../redux/selectors/dataSelectors';
import { useProjectDetail } from './useProjectDetail';

/**
 * Reads umbrella project details through Redux using its configured identity.
 * The bootstrap record supplies only the shortname during migration; its fields
 * are never returned as a fallback for missing or denied detail data.
 *
 * @param {Object} [options={}] - Profile and optional includes for the detail request.
 * @returns {Object} Project details and request status, including refresh.
 */
export function useUmbrellaProject(options = {}) {
    const identity = useSelector(getUmbrellaProject);
    const details = useProjectDetail(identity?.shortname, options);
    return { ...details, isLoading: !identity?.shortname || details.isLoading };
}
