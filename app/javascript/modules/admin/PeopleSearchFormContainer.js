import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { resetQuery, setQueryParams, getPeopleQuery } from 'modules/search';
import { fetchData, getProjects, getPeopleStatus } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: getPeopleQuery(state),
    dataStatus: getPeopleStatus(state),
    scope: 'person',
    searchableAttributes: [
        {attributeName: 'first_name'},
        {attributeName: 'last_name'},
        {attributeName: 'birth_name'},
        {attributeName: 'alias_names'},
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideFlyoutTabs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
