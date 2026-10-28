import { AnalyticsProvider } from 'modules/analytics';
import { useI18n } from 'modules/i18n';
import { Layout } from 'modules/layout';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { useSelector } from 'react-redux';

import { getIsRedirectingAfterLogout } from '../user/selectors';
import NotFoundPage from './NotFoundPage';
import {
    MemoizedRoutesWithProjectId,
    MemoizedRoutesWithoutProjectId,
} from './Routes';
import useProject from './useProject';

/**
 * Selects project-prefixed or locale-only routes from loaded project display settings.
 * @returns {React.ReactElement} Application routes, loading indicator, or project request error.
 */
function RouteDivider() {
    const { t } = useI18n();
    const { project, projectShortname, isLoading, error } = useProject();
    const isRedirecting = useSelector(getIsRedirectingAfterLogout);
    const loading = (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <Spinner />
        </div>
    );
    if (isRedirecting) return loading;
    if (error?.status === 403 || error?.status === 404)
        return (
            <NotFoundPage
                status={error.status}
                projectShortname={projectShortname}
                publicHome
            />
        );
    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return loading;

    const useRoutesWithoutProjectId =
        Boolean(project?.archive_domain) || Boolean(project?.is_umbrella);

    return (
        <AnalyticsProvider>
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
