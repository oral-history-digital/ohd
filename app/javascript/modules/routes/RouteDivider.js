import { AnalyticsProvider } from 'modules/analytics';
import { useCurrentProject } from 'modules/data';
import { Layout } from 'modules/layout';

import {
    MemoizedRoutesWithProjectId,
    MemoizedRoutesWithoutProjectId,
} from './Routes';

function RouteDivider() {
    const { project } = useCurrentProject();

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
