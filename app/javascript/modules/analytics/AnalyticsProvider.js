import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';

import { ANALYTICS_URL_BASE, ANALYTICS_DEFAULT_SITE_ID } from 'modules/constants';

// At the moment, only projects with own domains are tracked.
export default function AnalyticsProvider({
    project,
    children,
}) {
    if (['development', 'test'].indexOf(railsMode) > -1) {
        return children;
    }

    const instance = useMemo(() => {
        const result = createInstance({
            urlBase: ANALYTICS_URL_BASE,
            // If siteId does not exist, nothing is tracked, but we need to provide an id.
            siteId: project.analytics_site_id || ANALYTICS_DEFAULT_SITE_ID,
            disabled: !shouldTrack(),
        });
        return result;
    }, []);

    function shouldTrack() {
        return isOnOHD() || isExternalAndHasSiteId();
    }

    function isOnOHD() {
        return project.is_ohd || !project.archive_domain;
    }

    function isExternalAndHasSiteId() {
        return project.archive_domain
            && Number.isInteger(project.analytics_site_id);
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