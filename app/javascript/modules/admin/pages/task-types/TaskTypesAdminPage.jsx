import {
    getTaskTypesForCurrentProject,
    getTaskTypesStatus,
} from 'modules/data';
import { useProjectIdentity } from 'modules/routes';
import { getTaskTypesQuery } from 'modules/search';
import { Spinner } from 'modules/spinners';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';
import TaskTypePermissions from './TaskTypePermissions';

/**
 * Lists project-scoped resources without loading project details.
 * @returns {React.ReactElement} Administration list or pending project identity.
 */
export default function TaskTypesAdminPage() {
    const { projectDbId } = useProjectIdentity();
    const data = useSelector(getTaskTypesForCurrentProject);
    const dataStatus = useSelector(getTaskTypesStatus);
    const query = useSelector(getTaskTypesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    if (!projectDbId) return <Spinner />;

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={query}
            outerScope="project"
            outerScopeId={projectDbId}
            scope="task_type"
            detailsAttributes={['name', 'desc']}
            initialFormValues={{ project_id: projectDbId }}
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
