import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Edits project-owned external links from the edit profile.
 * @returns {React.ReactElement} Resource list, loading indicator, or request error.
 */
export default function ExternalLinks() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit', include: ['external_links'] });
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (projectLoading || !project) return <Spinner />;

    return (
        <DataList
            editView
            data={project.external_links}
            outerScope="project"
            outerScopeId={project.id}
            scope="external_link"
            detailsAttributes={['name', 'url']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                { attribute: 'internal_name' },
                { attribute: 'name', multiLocale: true },
                { attribute: 'url', multiLocale: true },
            ]}
            helpTextCode="external_link_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
