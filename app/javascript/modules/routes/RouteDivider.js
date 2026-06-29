import { AnalyticsProvider } from 'modules/analytics';
import { useCurrentProject } from 'modules/data';
import { Layout } from 'modules/layout';

import {
    MemoizedRoutesWithProjectId,
    MemoizedRoutesWithoutProjectId,
} from './Routes';

function RouteDivider() {
    const { project } = useCurrentProject();

    const useRoutesWithoutProjectId =
        Boolean(project?.archive_domain) || Boolean(project?.is_ohd);

    return (
        <AnalyticsProvider project={project}>
            <Layout>
                {useRoutesWithoutProjectId ? (
                    <MemoizedRoutesWithoutProjectId project={project} />
                ) : (
                    <MemoizedRoutesWithProjectId />
                )}
            </Layout>
        </AnalyticsProvider>
    );
}

export default RouteDivider;
