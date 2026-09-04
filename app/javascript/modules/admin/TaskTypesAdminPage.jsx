import {
    getCurrentProject,
    getTaskTypesForCurrentProject,
    getTaskTypesStatus,
} from 'modules/data';
import { getTaskTypesQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import TaskTypePermissions from './TaskTypePermissions';
import { PaginatedAdminRecordList } from './components';
import { useAdminDataActions } from './hooks';

export default function TaskTypesAdminPage() {
    const project = useSelector(getCurrentProject);
    const data = useSelector(getTaskTypesForCurrentProject);
    const dataStatus = useSelector(getTaskTypesStatus);
    const query = useSelector(getTaskTypesQuery);
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
            scope="task_type"
            detailsAttributes={['name', 'desc']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                {
                    attribute: 'label',
                    multiLocale: true,
                },
                {
                    attribute: 'key',
                },
                {
                    attribute: 'abbreviation',
                    validate: (v) => v?.length > 1,
                },
                {
                    elementType: 'input',
                    attribute: 'use',
                    type: 'checkbox',
                },
            ]}
            joinedData={{
                task_type_permission: TaskTypePermissions,
            }}
            helpTextCode="task_type_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
