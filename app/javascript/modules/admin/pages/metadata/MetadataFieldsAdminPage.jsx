import {
    getCurrentProject,
    getRegistryReferenceTypesStatus,
} from 'modules/data';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';
import MetadataFieldForm from './MetadataFieldForm';
import MetadataFieldShow from './MetadataFieldShow';

export default function MetadataFieldsAdminPage() {
    const project = useSelector(getCurrentProject);
    const joinDataStatus = useSelector(getRegistryReferenceTypesStatus);
    const { fetchData, deleteData, submitData } = useAdminDataActions();

    return (
        <PaginatedAdminRecordList
            data={project.metadata_fields}
            outerScope="project"
            outerScopeId={project.id}
            scope="metadata_field"
            joinDataStatus={joinDataStatus}
            joinDataScope="registry_reference_types"
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
