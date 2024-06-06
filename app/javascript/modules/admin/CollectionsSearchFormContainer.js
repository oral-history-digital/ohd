import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams, getCollectionsQuery } from 'modules/search';
import { fetchData } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getCollectionsQuery(state),
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
