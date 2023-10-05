import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
import { MemoizedRoutesWithoutProjectId, MemoizedRoutesWithProjectId } from './Routes';
import TrackingProvider from './TrackingProvider';
import useProject from './useProject';

function RouteDivider() {
    const { project } = useProject();
    const isScrollBelowThreshold = useScrollBelowThreshold();

    return (
        <TrackingProvider>
            <LayoutContainer scrollPositionBelowThreshold={isScrollBelowThreshold}>
                {project.archive_domain ?
                    <MemoizedRoutesWithoutProjectId project={project} /> :
                    <MemoizedRoutesWithProjectId />
                }
            </LayoutContainer>
        </TrackingProvider>
    );
}

export default RouteDivider;
