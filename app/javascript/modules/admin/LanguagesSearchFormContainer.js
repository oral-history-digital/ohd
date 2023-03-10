import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams, getLanguagesQuery } from 'modules/search';
import { fetchData, getCurrentProject, getLanguagesStatus } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    query: getLanguagesQuery(state),
    dataStatus: getLanguagesStatus(state),
    scope: 'language',
    searchableAttributes: [
        {attributeName: 'name'},
        {attributeName: 'code'},
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
