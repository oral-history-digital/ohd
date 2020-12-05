import { connect } from 'react-redux';

import WrappedDataList from '../components/WrappedDataList';
import { setQueryParams } from '../actions/searchActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: getCookie('editView') === 'true',
        data: state.data.collections,
        dataStatus: state.data.statuses.collections,
        resultPagesCount: state.data.statuses.collections.resultPagesCount,
        query: state.search.collections.query,
        scope: 'collection',
        baseTabIndex: 4 + project.has_map,
        //detailsAttributes: ['name'],
        detailsAttributes: ['name', 'homepage', 'institution', 'responsibles', 'notes', 'countries'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'homepage',
                multiLocale: true,
                //validate: function(v){return /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(v)},
            },
            {
                attribute: 'institution',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'responsibles',
                multiLocale: true,
            },
            {
                attribute: 'notes',
                multiLocale: true,
            },
            {
                attribute: 'countries',
                multiLocale: true,
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
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
