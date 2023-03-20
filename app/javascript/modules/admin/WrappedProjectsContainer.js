import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getProjectLocales,
    getCurrentUser } from 'modules/data';
import DataList from './DataList';
import { getProjectsStatus, ProjectTile } from 'modules/data';
import { INDEX_PROJECTS } from 'modules/sidebar';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: getProjectLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        user: getCurrentUser(state),
        editView: getEditView(state),
        data: getProjects(state),
        dataStatus: getProjectsStatus(state),
        resultPagesCount: getProjectsStatus(state).resultPagesCount,
        query: state.search.projects.query,
        scope: 'project',
        detailsAttributes: ['title', 'workflow_state'],
        initialFormValues: {display_ohd_link: true, pseudo_view_modes: 'grid,list,workflow'},
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'shortname',
                validate: function(v){return /^[\-a-z0-9]{1,11}[a-z]$/.test(v)}
            },
            {
                attribute: 'default_locale',
                validate: function(v){return /^[a-z]{2}$/.test(v)}
            },
            {
                attribute: "pseudo_available_locales",
                validate: function(v){return /^([a-z]{2},?)+$/.test(v)}
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
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: ['public', 'unshared'],
                optionsScope: 'workflow_states'
            }
        ],
        showComponent: ProjectTile,
        helpTextCode: 'archive_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
