import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';
import userIsEditor from './userIsEditor';
import {
    CUSTOM_DIMENSION_USER_TYPE_ID,
    CUSTOM_DIMENSION_USER_TYPE_USER,
    CUSTOM_DIMENSION_USER_TYPE_EDITOR,
} from './constants';

/**
 * Returns trackPageView function that can be called by the client.
 */
export default function useTrackPageViewFunction() {
    const currentUser = useSelector(getCurrentUser);
    const { trackPageView: matomoTrackPageView, pushInstruction } = useMatomo();

    let options = {
        customDimensions: [
            {
                id: CUSTOM_DIMENSION_USER_TYPE_ID,
                value: (userIsEditor(currentUser) ?
                    CUSTOM_DIMENSION_USER_TYPE_EDITOR :
                    CUSTOM_DIMENSION_USER_TYPE_USER
                ),
            },
        ],
    };

    function trackPageView(title, delay = 0) {
        if (shouldTrack()) {
            if (title) {
                options.documentTitle = title;
            }
            setTimeout(() => {
                // Use setTimeout to wait for the document title to get updated.
                matomoTrackPageView(options);
            }, delay);
        }
    }

    function shouldTrack() {
        return currentUser && !currentUser.do_not_track;
    }

    return trackPageView;
}
