import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams, getCollectionsQuery } from 'modules/search';
import { fetchData, getCurrentProject, getCollectionsStatus } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    query: getCollectionsQuery(state),
    dataStatus: getCollectionsStatus(state),
    scope: 'collection',
    searchableAttributes: [
        {attributeName: 'name'},
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
