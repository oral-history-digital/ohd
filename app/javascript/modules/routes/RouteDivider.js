import { AnalyticsProvider } from 'modules/analytics';
import { Layout } from 'modules/layout';

import {
    MemoizedRoutesWithProjectId,
    MemoizedRoutesWithoutProjectId,
} from './Routes';
import useProject from './useProject';

function RouteDivider() {
    const { project } = useProject();

    const hasArchiveDomain = project && project.archive_domain;

    return (
        <AnalyticsProvider project={project}>
            <Layout>
                {hasArchiveDomain ? (
                    <MemoizedRoutesWithoutProjectId project={project} />
                ) : (
                    <MemoizedRoutesWithProjectId />
                )}
            </Layout>
        </AnalyticsProvider>
    );
}

export default RouteDivider;
