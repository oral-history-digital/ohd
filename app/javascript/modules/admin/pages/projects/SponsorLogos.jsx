import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Edits project-owned sponsor logos from the edit profile.
 * @returns {React.ReactElement} Resource list, loading indicator, or request error.
 */
export default function SponsorLogos() {
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
            data={project.sponsor_logos}
            outerScope="project"
            outerScopeId={project.id}
            scope="sponsor_logo"
            detailsAttributes={['src', 'locale']}
            initialFormValues={{
                ref_id: project.id,
                ref_type: 'Project',
                type: 'SponsorLogo',
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
                { attribute: 'href' },
                { attribute: 'title' },
            ]}
            helpTextCode="sponsor_logo_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
