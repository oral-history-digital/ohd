import {
    getCollectionsForCurrentProject,
    getCollectionsStatus,
    getCurrentProject,
} from 'modules/data';
import { getCollectionsQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function CollectionsAdminPage() {
    const project = useSelector(getCurrentProject);
    const data = useSelector(getCollectionsForCurrentProject);
    const dataStatus = useSelector(getCollectionsStatus);
    const collectionsQuery = useSelector(getCollectionsQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={{
                ...collectionsQuery,
                // Always fetch collections scoped to the current project in admin.
                for_projects: project.id,
            }}
            outerScope="project"
            outerScopeId={project.id}
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
            initialFormValues={{ project_id: project.id }}
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
