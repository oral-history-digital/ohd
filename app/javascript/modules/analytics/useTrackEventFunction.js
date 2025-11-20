import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useSelector } from 'react-redux';

import { getCurrentUser } from 'modules/data';
import userIsEditor from './userIsEditor';
import {
    CUSTOM_DIMENSION_USER_TYPE_ID,
    CUSTOM_DIMENSION_USER_TYPE_USER,
    CUSTOM_DIMENSION_USER_TYPE_EDITOR,
} from './constants';

/**
 * Returns trackEvent function that can be called by the client.
 */
export default function useTrackEventFunction() {
    const currentUser = useSelector(getCurrentUser);
    const { trackEvent: matomoTrackEvent } = useMatomo();

    let options = {
        customDimensions: [
            {
                id: CUSTOM_DIMENSION_USER_TYPE_ID,
                value: userIsEditor(currentUser)
                    ? CUSTOM_DIMENSION_USER_TYPE_EDITOR
                    : CUSTOM_DIMENSION_USER_TYPE_USER,
            },
        ],
    };

    function trackEvent(category, action, name, value) {
        if (shouldTrack()) {
            options.category = category;
            options.action = action;
            if (!category) {
                throw new ReferenceError('category must be present');
            }
            if (!action) {
                throw new ReferenceError('action must be present');
            }
            if (typeof category !== 'string') {
                throw new TypeError('category must be of type string');
            }
            if (typeof action !== 'string') {
                throw new TypeError('action must be of type string');
            }
            if (name) {
                if (typeof value !== 'string') {
                    throw new TypeError('name must be of type string');
                }
                options.name = name;
            }
            if (value) {
                if (typeof value !== 'number') {
                    throw new TypeError('value must be of type number');
                }
                options.value = value;
            }
            matomoTrackEvent(options);
        }
    }

    function shouldTrack() {
        return currentUser && !currentUser.do_not_track;
    }

    return trackEvent;
}
