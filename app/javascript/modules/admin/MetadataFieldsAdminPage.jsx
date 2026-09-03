import { useCallback } from 'react';

import {
    deleteData,
    fetchData,
    getCurrentProject,
    getRegistryReferenceTypesStatus,
    submitData,
} from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';

import MetadataFieldForm from './MetadataFieldForm';
import MetadataFieldShow from './MetadataFieldShow';
import { PaginatedAdminRecordList } from './components';

export default function MetadataFieldsAdminPage() {
    const dispatch = useDispatch();
    const project = useSelector(getCurrentProject);
    const joinDataStatus = useSelector(getRegistryReferenceTypesStatus);
    const fetchAdminData = useCallback(
        (...args) => dispatch(fetchData(...args)),
        [dispatch]
    );
    const deleteAdminData = useCallback(
        (...args) => dispatch(deleteData(...args)),
        [dispatch]
    );
    const submitAdminData = useCallback(
        (...args) => dispatch(submitData(...args)),
        [dispatch]
    );

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
            fetchData={fetchAdminData}
            deleteData={deleteAdminData}
            submitData={submitAdminData}
        />
    );
}
