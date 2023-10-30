import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';

import { ANALYTICS_URL_BASE } from 'modules/constants';

// At the moment, only projects with own domains are tracked.
export default function AnalyticsProvider({
    project,
    children,
}) {
    const siteId = project.analytics_site_id;

    const instance = useMemo(() => {
        const result = createInstance({
            urlBase: ANALYTICS_URL_BASE,
            siteId: siteId || 1, // If siteId does not exist, nothing is tracked.
                                // But we need to provide an id anyway.
            disabled: !shouldTrack(),
        });
        console.log('Instance created', result);
        return result;
    }, [siteId]);

    function shouldTrack() {
        return Number.isInteger(siteId);
    }

    return (
        <MatomoProvider value={instance}>
            {children}
        </MatomoProvider>
    );
}

AnalyticsProvider.propTypes = {
    project: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};
