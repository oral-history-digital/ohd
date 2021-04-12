import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData, getProjects, getRegistryReferenceTypesStatus } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    translations: getTranslations(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: state.search.registry_reference_types.query,
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
    hideFlyoutTabs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
