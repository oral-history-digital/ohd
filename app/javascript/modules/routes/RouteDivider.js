import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
import { MemoizedRoutesWithoutProjectId, MemoizedRoutesWithProjectId } from './Routes';
import { AnalyticsProvider } from 'modules/analytics';
import useProject from './useProject';

function RouteDivider() {
    const { project } = useProject();
    const isScrollBelowThreshold = useScrollBelowThreshold();

    return (
        <AnalyticsProvider project={project}>
            <LayoutContainer scrollPositionBelowThreshold={isScrollBelowThreshold}>
                {project.archive_domain ?
                    <MemoizedRoutesWithoutProjectId project={project} /> :
                    <MemoizedRoutesWithProjectId />
                }
            </LayoutContainer>
        </AnalyticsProvider>
    );
}

export default RouteDivider;
