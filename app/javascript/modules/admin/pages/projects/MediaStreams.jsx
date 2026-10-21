import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Edits project-owned media streams from the edit profile.
 * @returns {React.ReactElement} Resource list, loading indicator, or request error.
 */
export default function MediaStreams() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit', include: ['playback'] });
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
            data={project.media_streams}
            outerScope="project"
            outerScopeId={project.id}
            scope="media_stream"
            detailsAttributes={['path', 'media_type']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                {
                    attribute: 'media_type',
                    elementType: 'select',
                    values: ['still', 'video', 'audio'],
                    withEmpty: true,
                },
                {
                    attribute: 'path',
                    elementType: 'input',
                    help: 'help_texts.media_streams.path',
                },
                { attribute: 'resolution', elementType: 'input' },
            ]}
            helpTextCode="mediapath_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
