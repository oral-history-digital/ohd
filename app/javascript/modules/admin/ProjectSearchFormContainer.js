import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams } from 'modules/search';
import { fetchData } from 'modules/data';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = state => ({
    translations: state.archive.translations,
    locale: state.archive.locale,
    query: state.search.projects.query,
    dataStatus: state.data.statuses.projects,
    scope: 'project',
    searchableAttributes: [{ attributeName: 'name' }],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideFlyoutTabs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
