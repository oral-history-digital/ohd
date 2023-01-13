import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData, getProjectLocales, getProjects, getUserRegistrationsStatus } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';
import { getUserRegistrationsQuery } from '../search';

const mapStateToProps = state => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: getUserRegistrationsQuery(state),
    dataStatus: getUserRegistrationsStatus(state),
    scope: 'user_registration',
    searchableAttributes: [
        {
            attributeName: 'first_name'
        },
        {
            attributeName: 'last_name'
        },
        {
            attributeName: 'email'
        },
        {
            attributeName: 'default_locale',
            type: 'select',
            value: getLocale(state),
            values: getProjectLocales(state),
        },
        {
            attributeName: 'user_registration_projects.workflow_state',
            type: 'select',
            value: 'account_confirmed',
            values: ['all', 'account_confirmed', 'project_access_granted', 'project_access_postponed', 'project_access_rejected', 'account_deactivated']
        }
    ],
    helpTextCode: 'user_search_form'
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
