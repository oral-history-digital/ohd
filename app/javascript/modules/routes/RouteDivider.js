import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
import { useProject } from 'modules/routes';
import { MemoizedRoutesWithoutProjectId, MemoizedRoutesWithProjectId } from './Routes';

function RouteDivider() {
    const { project } = useProject();
    const isScrollBelowThreshold = useScrollBelowThreshold();

    return (
        <LayoutContainer scrollPositionBelowThreshold={isScrollBelowThreshold}>
            {project.archive_domain ?
                <MemoizedRoutesWithoutProjectId project={project} /> :
                <MemoizedRoutesWithProjectId />
            }
        </LayoutContainer>
    );
}

export default RouteDivider;
