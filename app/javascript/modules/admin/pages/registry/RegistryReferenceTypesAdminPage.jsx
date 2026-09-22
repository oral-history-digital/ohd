import {
    getCurrentProject,
    getRegistryReferenceTypesForCurrentProject,
    getRegistryReferenceTypesStatus,
} from 'modules/data';
import { getRegistryReferenceTypesQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function RegistryReferenceTypesAdminPage() {
    const project = useSelector(getCurrentProject);
    const data = useSelector(getRegistryReferenceTypesForCurrentProject);
    const dataStatus = useSelector(getRegistryReferenceTypesStatus);
    const query = useSelector(getRegistryReferenceTypesQuery);
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
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
