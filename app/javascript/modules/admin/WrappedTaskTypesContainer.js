import { connect } from 'react-redux';

import { setQueryParams } from 'modules/search';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject } from 'modules/data';
import TaskTypePermissionsContainer from './TaskTypePermissionsContainer';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: state.data.task_types,
        dataStatus: state.data.statuses.task_types,
        resultPagesCount: state.data.statuses.task_types.resultPagesCount,
        query: state.search.task_types.query,
        scope: 'task_type',
        baseTabIndex: 5 + project.has_map,
        detailsAttributes: ['name', 'desc'],
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
                validate: function(v){return v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'use',
                type: 'checkbox',
            },
            {
                elementType: 'select',
                attribute: 'project_id',
                values: state.data.projects,
                withEmpty: true,
            },
        ],
        joinedData: {task_type_permission: TaskTypePermissionsContainer},
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
