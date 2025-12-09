import { AnalyticsProvider } from 'modules/analytics';
import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';

import {
    MemoizedRoutesWithProjectId,
    MemoizedRoutesWithoutProjectId,
} from './Routes';
import useProject from './useProject';

function RouteDivider() {
    const { project } = useProject();
    const isScrollBelowThreshold = useScrollBelowThreshold();

    const hasArchiveDomain = project && project.archive_domain;

    return (
        <AnalyticsProvider project={project}>
            <LayoutContainer
                scrollPositionBelowThreshold={isScrollBelowThreshold}
            >
                {hasArchiveDomain ? (
                    <MemoizedRoutesWithoutProjectId project={project} />
                ) : (
                    <MemoizedRoutesWithProjectId />
                )}
            </LayoutContainer>
        </AnalyticsProvider>
    );
}

export default RouteDivider;
