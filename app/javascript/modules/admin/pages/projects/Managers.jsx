import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

import { AffiliateForm, AffiliateShow, DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Edits project-owned managers from the edit profile.
 * @returns {React.ReactElement} Resource list, loading indicator, or request error.
 */
export default function Managers() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit', include: ['affiliates'] });
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
            data={project.managers}
            outerScope="project"
            outerScopeId={project.id}
            scope="manager"
            detailsAttributes={['name', 'first_name', 'last_name']}
            initialFormValues={{ project_id: project.id, type: 'Manager' }}
            form={AffiliateForm}
            showComponent={AffiliateShow}
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
