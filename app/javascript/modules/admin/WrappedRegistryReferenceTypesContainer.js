import {
    deleteData,
    fetchData,
    getCurrentProject,
    getRegistryReferenceTypesForCurrentProject,
    getRegistryReferenceTypesStatus,
    submitData,
} from 'modules/data';
import { getRegistryReferenceTypesQuery, setQueryParams } from 'modules/search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        data: getRegistryReferenceTypesForCurrentProject(state),
        dataStatus: getRegistryReferenceTypesStatus(state),
        resultPagesCount:
            getRegistryReferenceTypesStatus(state).resultPagesCount,
        query: getRegistryReferenceTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'registry_reference_type',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        detailsAttributes: ['name'],
        initialFormValues: { project_id: project.id },
        formElements: [
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
        ],
        joinedData: {},
        helpTextCode: 'registry_reference_type_form',
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
            setQueryParams,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
