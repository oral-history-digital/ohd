import {
    getCollectionsForCurrentProject,
    getCollectionsStatus,
} from 'modules/data';
import { useProjectIdentity } from 'modules/routes';
import { getCollectionsQuery } from 'modules/search';
import { Spinner } from 'modules/spinners';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Lists project-scoped resources without loading project details.
 * @returns {React.ReactElement} Administration list or pending project identity.
 */
export default function CollectionsAdminPage() {
    const { projectDbId } = useProjectIdentity();
    const data = useSelector(getCollectionsForCurrentProject);
    const dataStatus = useSelector(getCollectionsStatus);
    const collectionsQuery = useSelector(getCollectionsQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    if (!projectDbId) return <Spinner />;

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={{
                ...collectionsQuery,
                // Always fetch collections scoped to the current project in admin.
                for_projects: projectDbId,
            }}
            outerScope="project"
            outerScopeId={projectDbId}
            scope="collection"
            sortAttribute="name"
            sortAttributeTranslated
            detailsAttributes={[
                'name',
                'homepage',
                'responsibles',
                'notes',
                'doi_status',
            ]}
            initialFormValues={{ project_id: projectDbId }}
            formElements={[
                {
                    attribute: 'name',
                    multiLocale: true,
                    baseLocales: ['de', 'en'],
                },
                {
                    attribute: 'shortname',
                },
                {
                    attribute: 'publication_date',
                    validate: function (v) {
                        return /^\d{4}$/.test(v);
                    },
                },
                {
                    attribute: 'workflow_state',
                    elementType: 'select',
                    values: ['public', 'unshared'],
                    optionsScope: 'workflow_states',
                },
                {
                    attribute: 'homepage',
                    multiLocale: true,
                    baseLocales: ['de', 'en'],
                },
                {
                    attribute: 'responsibles',
                    multiLocale: true,
                    baseLocales: ['de', 'en'],
                    elementType: 'textarea',
                    htmlOptions: { maxLength: 255 },
                },
                {
                    attribute: 'notes',
                    multiLocale: true,
                    baseLocales: ['de', 'en'],
                    elementType: 'richTextEditor',
                },
            ]}
            hideRegisterDoiAction={false}
            joinedData={{}}
            helpTextCode="collection_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
