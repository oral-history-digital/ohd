import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { resetQuery, setQueryParams, getRegistryReferenceTypesQuery } from 'modules/search';
import { fetchData, getCurrentProject, getRegistryReferenceTypesStatus } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    query: getRegistryReferenceTypesQuery(state),
    dataStatus: getRegistryReferenceTypesStatus(state),
    scope: 'registry_reference_type',
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
