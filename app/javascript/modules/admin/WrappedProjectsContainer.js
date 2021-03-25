import { connect } from 'react-redux';

import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject } from 'modules/data';
import DataList from './DataList';
import ProjectShow from './ProjectShow';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        translations: getTranslations(state),
        account: state.data.accounts.current,
        editView: getEditView(state),
        data: state.data.projects,
        dataStatus: state.data.statuses.projects,
        resultPagesCount: state.data.statuses.projects.resultPagesCount,
        query: state.search.projects.query,
        scope: 'project',
        baseTabIndex: 5 + (project ? project.has_map : 0),
        detailsAttributes: ['title'],
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'shortname',
                validate: function(v){return v.length > 1}
            },
            {
                attribute: 'default_locale',
                validate: function(v){return /^[a-z]{2}$/.test(v)}
            },
            {
                attribute: "pseudo_available_locales",
            },
            {
                attribute: "archive_domain",
                //validate: function(v){return /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(v)},
                help: 'activerecord.attributes.project.archive_domain_help'
            },
        ],
        showComponent: ProjectShow,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
