import { connect } from 'react-redux';

import DataSearchForm from '../components/DataSearchForm';
import {
    resetQuery,
    setQueryParams,
} from '../actions/searchActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
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
                values: (project && project.available_locales) || state.archive.locales,
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
