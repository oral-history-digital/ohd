/* global railsMode */
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { ANALYTICS_URL_BASE } from 'modules/constants';

const metaTag = document.head.querySelector(
    'meta[name~=analytics_site_id][content]'
);
const metaTagContent = metaTag?.content;
const analyticsSiteId = metaTagContent ? Number.parseInt(metaTagContent) : null;

// At the moment, only projects with own domains are tracked.
export default function AnalyticsProvider({ children }) {
    const instance = useMemo(() => {
        // Skip Matomo creation in development and test environments
        if (['development', 'test'].indexOf(railsMode) > -1) {
            return null;
        }

        const result = createInstance({
            urlBase: ANALYTICS_URL_BASE,
            // If siteId does not exist, nothing is tracked, but we need to provide an id.
            siteId: analyticsSiteId,
        });
        return result;
    }, []);

    if (instance === null) {
        return children;
    }

    return <MatomoProvider value={instance}>{children}</MatomoProvider>;
}

AnalyticsProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
