import { connect } from 'react-redux';

import { getLocale, getLocales, getProjectId, getTranslations } from 'modules/archive';
import { setQueryParams } from 'modules/search';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getCollections } from 'modules/data';
import { getCookie } from 'modules/persistence';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getCookie('editView') === 'true',
        data: getCollections(state),
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
