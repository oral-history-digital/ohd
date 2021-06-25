import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects,
    getCurrentAccount } from 'modules/data';
import DataList from './DataList';
import { getProjectsStatus, ProjectShow } from 'modules/data';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        data: getProjects(state),
        dataStatus: getProjectsStatus(state),
        resultPagesCount: getProjectsStatus(state).resultPagesCount,
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
                elementType: 'input',
                attribute: 'contact_email',
                type: 'email',
                validate: function(v){return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)}
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

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
