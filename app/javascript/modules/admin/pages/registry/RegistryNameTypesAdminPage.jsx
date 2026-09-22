import {
    getCurrentProject,
    getRegistryNameTypesForCurrentProject,
    getRegistryNameTypesStatus,
} from 'modules/data';
import { getRegistryNameTypesQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function RegistryNameTypesAdminPage() {
    const project = useSelector(getCurrentProject);
    const data = useSelector(getRegistryNameTypesForCurrentProject);
    const dataStatus = useSelector(getRegistryNameTypesStatus);
    const query = useSelector(getRegistryNameTypesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

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
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
