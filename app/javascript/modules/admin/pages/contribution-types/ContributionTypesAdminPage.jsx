import {
    getContributionTypesForCurrentProject,
    getContributionTypesStatus,
} from 'modules/data';
import { useProjectIdentity } from 'modules/routes';
import { getContributionTypesQuery } from 'modules/search';
import { Spinner } from 'modules/spinners';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Lists project-scoped resources without loading project details.
 * @returns {React.ReactElement} Administration list or pending project identity.
 */
export default function ContributionTypesAdminPage() {
    const { projectDbId } = useProjectIdentity();
    const data = useSelector(getContributionTypesForCurrentProject);
    const dataStatus = useSelector(getContributionTypesStatus);
    const query = useSelector(getContributionTypesQuery);
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
            scope="contribution_type"
            sortAttribute="name"
            sortAttributeTranslated
            detailsAttributes={['code']}
            initialFormValues={{ project_id: projectDbId }}
            formElements={[
                {
                    attribute: 'label',
                    multiLocale: true,
                },
                {
                    attribute: 'code',
                    help: 'help_texts.contribution_types.code',
                    validate: function (v) {
                        return /^\w+$/.test(v);
                    },
                },
                {
                    attribute: 'use_in_details_view',
                    elementType: 'input',
                    type: 'checkbox',
                },
                {
                    attribute: 'display_on_landing_page',
                    elementType: 'input',
                    type: 'checkbox',
                },
                {
                    attribute: 'use_in_export',
                    elementType: 'input',
                    type: 'checkbox',
                },
                {
                    attribute: 'order',
                },
            ]}
            joinedData={{}}
            helpTextCode="contribution_type_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
