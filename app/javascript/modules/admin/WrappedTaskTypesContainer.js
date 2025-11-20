import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getTaskTypesQuery } from 'modules/search';
import {
    fetchData,
    deleteData,
    submitData,
    getCurrentProject,
    getTaskTypesForCurrentProject,
    getTaskTypesStatus,
} from 'modules/data';
import TaskTypePermissionsContainer from './TaskTypePermissionsContainer';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        data: getTaskTypesForCurrentProject(state),
        dataStatus: getTaskTypesStatus(state),
        resultPagesCount: getTaskTypesStatus(state).resultPagesCount,
        query: getTaskTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'task_type',
        detailsAttributes: ['name', 'desc'],
        initialFormValues: { project_id: project.id },
        formElements: [
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
        ],
        joinedData: { task_type_permission: TaskTypePermissionsContainer },
        helpTextCode: 'task_type_form',
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
