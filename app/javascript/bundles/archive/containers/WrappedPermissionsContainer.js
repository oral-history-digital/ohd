import { connect } from 'react-redux';

import WrappedDataList from '../components/WrappedDataList';
import {
    setQueryParams,
} from 'modules/search';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData } from 'modules/data';
import { getCookie, getProject } from 'lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: state.data.permissions,
        dataStatus: state.data.statuses.permissions,
        resultPagesCount: state.data.statuses.permissions.resultPagesCount,
        query: state.search.permissions.query,
        scope: 'permission',
        baseTabIndex: 5 + project.has_map,
        detailsAttributes: ['name', 'desc', 'klass', 'action_name'],
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v.length > 1}
            },
            {
                elementType: 'textarea',
                attribute: 'desc',
            },
            {
                attribute: 'klass',
                validate: function(v){return v.length > 1}
            },
            {
                attribute: 'action_name',
                validate: function(v){return v.length > 1}
            },
        ]
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
