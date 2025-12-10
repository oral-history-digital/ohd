import {
    deleteData,
    fetchData,
    getCurrentProject,
    getRegistryNameTypesForCurrentProject,
    getRegistryNameTypesStatus,
    submitData,
} from 'modules/data';
import { getRegistryNameTypesQuery, setQueryParams } from 'modules/search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        data: getRegistryNameTypesForCurrentProject(state),
        dataStatus: getRegistryNameTypesStatus(state),
        resultPagesCount: getRegistryNameTypesStatus(state).resultPagesCount,
        query: getRegistryNameTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'registry_name_type',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        detailsAttributes: ['name'],
        initialFormValues: { project_id: project.id },
        formElements: [
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
        ],
        joinedData: {},
        helpTextCode: 'registry_name_type_form',
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
