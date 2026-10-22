import { AnalyticsProvider } from 'modules/analytics';
import { useI18n } from 'modules/i18n';
import { Layout } from 'modules/layout';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

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
    const { project, isLoading, error } = useProject();
    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner withPadding />;

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
