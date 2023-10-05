import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';

import { TRACKING_URL_BASE } from 'modules/constants';
import useProject from './useProject';

// At the moment, only projects with own domains are tracked.
export default function TrackingProvider({ children }) {
    const { project } = useProject();

    const siteId = project.tracking_site_id;

    const instance = useMemo(() => Number.isInteger(siteId)
        ? createInstance({
            urlBase: TRACKING_URL_BASE,
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

TrackingProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};
