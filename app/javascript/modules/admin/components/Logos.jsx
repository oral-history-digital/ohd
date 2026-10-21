import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

import { useAdminDataActions } from '../hooks';
import DataList from './DataList';

/**
 * Edits project-owned logos from the edit profile.
 * @returns {React.ReactElement} Resource list, loading indicator, or request error.
 */
export default function Logos() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit', include: ['branding'] });
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
            data={project?.logos}
            outerScope="project"
            outerScopeId={project?.id}
            scope="logo"
            detailsAttributes={['src', 'locale']}
            initialFormValues={{
                ref_id: project?.id,
                ref_type: 'Project',
                type: 'Logo',
            }}
            formElements={[
                {
                    attribute: 'locale',
                    elementType: 'select',
                    values: project.available_locales,
                    withEmpty: true,
                },
                {
                    attribute: 'file',
                    elementType: 'fileInput',
                    preview: 'image',
                },
            ]}
            helpTextCode="logo_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
