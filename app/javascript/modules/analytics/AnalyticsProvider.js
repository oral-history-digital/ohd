import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';

import { ANALYTICS_URL_BASE } from 'modules/constants';

const metaTagContent = document.head.querySelector("meta[name~=analytics_site_id][content]").content;
const analyticsSiteId = Number.parseInt(metaTagContent);

// At the moment, only projects with own domains are tracked.
export default function AnalyticsProvider({
    children,
}) {
    if (['development', 'test'].indexOf(railsMode) > -1) {
        return children;
    }

    const instance = useMemo(() => {
        const result = createInstance({
            urlBase: ANALYTICS_URL_BASE,
            // If siteId does not exist, nothing is tracked, but we need to provide an id.
            siteId: analyticsSiteId,
        });
        return result;
    }, []);

    return (
        <MatomoProvider value={instance}>
            {children}
        </MatomoProvider>
    );
}

AnalyticsProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};
