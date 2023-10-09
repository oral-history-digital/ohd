import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';

import { ANALYTICS_URL_BASE } from 'modules/constants';

// At the moment, only projects with own domains are tracked.
export default function AnalyticsProvider({
    project,
    children,
}) {
    const siteId = project.tracking_site_id;

    const instance = useMemo(() => Number.isInteger(siteId)
        ? createInstance({
            urlBase: ANALYTICS_URL_BASE,
            siteId,
        })
        : null
    , [siteId]);

    if (instance) {
        return (
            <MatomoProvider value={instance}>
                {children}
            </MatomoProvider>
        );
    } else {
        return children;
    }
}

AnalyticsProvider.propTypes = {
    project: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};
