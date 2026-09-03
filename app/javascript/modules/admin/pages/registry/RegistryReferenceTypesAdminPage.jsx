import { useCallback } from 'react';

import {
    deleteData,
    fetchData,
    getCurrentProject,
    getRegistryReferenceTypesForCurrentProject,
    getRegistryReferenceTypesStatus,
    submitData,
} from 'modules/data';
import { getRegistryReferenceTypesQuery, setQueryParams } from 'modules/search';
import { useDispatch, useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';

export default function RegistryReferenceTypesAdminPage() {
    const dispatch = useDispatch();
    const project = useSelector(getCurrentProject);
    const data = useSelector(getRegistryReferenceTypesForCurrentProject);
    const dataStatus = useSelector(getRegistryReferenceTypesStatus);
    const query = useSelector(getRegistryReferenceTypesQuery);
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
    const updateQueryParams = useCallback(
        (...args) => dispatch(setQueryParams(...args)),
        [dispatch]
    );

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={query}
            outerScope="project"
            outerScopeId={project.id}
            scope="registry_reference_type"
            sortAttribute="name"
            sortAttributeTranslated
            detailsAttributes={['name']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                {
                    elementType: 'registryEntrySelect',
                    attribute: 'registry_entry_id',
                    goDeeper: true,
                    help: 'help_texts.registry_reference_types.registry_entry_id',
                    validate: function (v) {
                        return (
                            /^\d+$/.test(v) &&
                            v !== parseInt(project?.root_registry_entry_id)
                        );
                    },
                },
                {
                    attribute: 'use_in_transcript',
                    elementType: 'input',
                    type: 'checkbox',
                },
                {
                    attribute: 'name',
                    multiLocale: true,
                },
                {
                    attribute: 'code',
                    help: 'help_texts.registry_reference_types.code',
                    validate: function (v) {
                        return /^\w+$/.test(v);
                    },
                },
            ]}
            joinedData={{}}
            helpTextCode="registry_reference_type_form"
            fetchData={fetchAdminData}
            deleteData={deleteAdminData}
            submitData={submitAdminData}
            setQueryParams={updateQueryParams}
        />
    );
}
