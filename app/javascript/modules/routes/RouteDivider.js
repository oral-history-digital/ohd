import { AnalyticsProvider } from 'modules/analytics';
import { Layout } from 'modules/layout';

import {
    MemoizedRoutesWithProjectId,
    MemoizedRoutesWithoutProjectId,
} from './Routes';
import useProject from './useProject';

function RouteDivider() {
    const { project } = useProject();

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
