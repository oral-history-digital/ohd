import {
    getRegistryReferenceTypesForCurrentProject,
    getRegistryReferenceTypesStatus,
} from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { getRegistryReferenceTypesQuery } from 'modules/search';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Lists registry reference types using the current project's root-entry configuration.
 * @returns {React.ReactElement} Administration list, loading indicator, or request error.
 */
export default function RegistryReferenceTypesAdminPage() {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({
        include: ['registry_configuration'],
    });
    const data = useSelector(getRegistryReferenceTypesForCurrentProject);
    const dataStatus = useSelector(getRegistryReferenceTypesStatus);
    const query = useSelector(getRegistryReferenceTypesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner />;

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
                            Number(v) !== project.root_registry_entry_id
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
