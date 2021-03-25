import { connect } from 'react-redux';

import { getLocale, getTranslations, getProjectId, getLocales } from 'modules/archive';
import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData, getCurrentProject } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        translations: getTranslations(state),
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        query: state.search.user_registrations.query,
        dataStatus: state.data.statuses.user_registrations,
        scope: 'user_registration',
        searchableAttributes: [
            {attributeName: 'first_name'},
            {attributeName: 'last_name'},
            {attributeName: 'email'},
            {
                attributeName: 'default_locale',
                type: 'select',
                values: (project && project.available_locales) || getLocales(state),
            },
            {attributeName: 'workflow_state', type: 'select', values: ['all', 'account_confirmed', 'project_access_granted', 'project_access_postponed', 'project_access_rejected', 'account_deactivated']}
        ]
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
