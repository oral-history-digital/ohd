import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';
import MetadataFieldForm from './MetadataFieldForm';
import MetadataFieldShow from './MetadataFieldShow';

/**
 * Lists editable metadata definitions, including stored labels for translation forms.
 * @returns {React.ReactElement} Metadata administration, loading indicator, or request error.
 */
export default function MetadataFieldsAdminPage() {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({
        profile: 'edit',
        include: ['metadata_fields'],
    });
    const { fetchData, deleteData, submitData } = useAdminDataActions();

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner />;

    return (
        <PaginatedAdminRecordList
            data={project.metadata_fields}
            outerScope="project"
            outerScopeId={project.id}
            scope="metadata_field"
            detailsAttributes={[
                'name',
                'use_as_facet',
                'use_in_results_table',
                'use_in_details_view',
                'use_in_map_search',
                'display_on_landing_page',
                'ref_object_type',
                'source',
                'label',
            ]}
            form={MetadataFieldForm}
            showComponent={MetadataFieldShow}
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
