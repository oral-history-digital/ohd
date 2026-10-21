import {
    FetchProjectResource,
    getRegistryNameTypesForCurrentProject,
    getRegistryNameTypesStatus,
} from 'modules/data';
import { useProjectIdentity } from 'modules/routes';
import { getRegistryNameTypesQuery } from 'modules/search';
import { Spinner } from 'modules/spinners';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Lists project-scoped resources without loading project details.
 * @returns {React.ReactElement} Administration list or pending project identity.
 */
export default function RegistryNameTypesAdminPage() {
    const { projectDbId } = useProjectIdentity();
    const data = useSelector(getRegistryNameTypesForCurrentProject);
    const dataStatus = useSelector(getRegistryNameTypesStatus);
    const query = useSelector(getRegistryNameTypesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    if (!projectDbId) return <Spinner />;

    return (
        <FetchProjectResource resource="registry_name_types">
            <PaginatedAdminRecordList
                data={data}
                dataStatus={dataStatus}
                resultPagesCount={dataStatus.resultPagesCount}
                query={query}
                outerScope="project"
                outerScopeId={projectDbId}
                scope="registry_name_type"
                sortAttribute="name"
                sortAttributeTranslated
                detailsAttributes={['name']}
                initialFormValues={{ project_id: projectDbId }}
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
        </FetchProjectResource>
    );
}
