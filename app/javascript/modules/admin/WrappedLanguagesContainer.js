import { connect } from 'react-redux';

import { setQueryParams } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject } from 'modules/data';
import { getCookie } from 'modules/persistence';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: getCookie('editView') === 'true',
        data: state.data.languages,
        dataStatus: state.data.statuses.languages,
        resultPagesCount: state.data.statuses.languages.resultPagesCount,
        query: state.search.languages.query,
        scope: 'language',
        baseTabIndex: 4 + project.has_map,
        //detailsAttributes: ['name'],
        detailsAttributes: ['code', 'name'],
        formElements: [
            {
                attribute: 'code',
                validate: function(v){return /^[a-z]+$/.test(v)}
            },
            {
                attribute: 'name',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
        ],
        joinedData: { },
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);