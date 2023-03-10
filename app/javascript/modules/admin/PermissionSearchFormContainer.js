import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { resetQuery, setQueryParams, getPermissionsQuery } from 'modules/search';
import { getCurrentProject, fetchData, getPermissionsStatus } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    query: getPermissionsQuery(state),
    dataStatus: getPermissionsStatus(state),
    scope: 'permission',
    searchableAttributes: [
        {attributeName: 'name'},
        {attributeName: 'klass'},
        {attributeName: 'action_name'},
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
