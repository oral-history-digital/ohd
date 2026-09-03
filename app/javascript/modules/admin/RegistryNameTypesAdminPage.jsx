import { useCallback } from 'react';

import {
    deleteData,
    fetchData,
    getCurrentProject,
    getRegistryNameTypesForCurrentProject,
    getRegistryNameTypesStatus,
    submitData,
} from 'modules/data';
import { getRegistryNameTypesQuery, setQueryParams } from 'modules/search';
import { useDispatch, useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from './components';

export default function RegistryNameTypesAdminPage() {
    const dispatch = useDispatch();
    const project = useSelector(getCurrentProject);
    const data = useSelector(getRegistryNameTypesForCurrentProject);
    const dataStatus = useSelector(getRegistryNameTypesStatus);
    const query = useSelector(getRegistryNameTypesQuery);
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
            scope="registry_name_type"
            sortAttribute="name"
            sortAttributeTranslated
            detailsAttributes={['name']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                //{
                //attribute: 'code',
                //help: 'help_texts.registry_name_types.code',
                //validate: function(v){return /^\w+$/.test(v)}
                //},
                {
                    attribute: 'name',
                    multiLocale: true,
                },
                {
                    attribute: 'order_priority',
                    validate: function (v) {
                        return /^\d+$/.test(v);
                    },
                },
            ]}
            joinedData={{}}
            helpTextCode="registry_name_type_form"
            fetchData={fetchAdminData}
            deleteData={deleteAdminData}
            submitData={submitAdminData}
            setQueryParams={updateQueryParams}
        />
    );
}
