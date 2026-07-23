import { getCurrentUser } from 'modules/data';
import { useSelector } from 'react-redux';

/**
 * Returns whether the current user may be tracked.
 *
 * Only logged-in users that have not opted out are tracked.
 */
export default function useShouldTrack() {
    const currentUser = useSelector(getCurrentUser);

    return Boolean(currentUser) && !currentUser.do_not_track;
}
