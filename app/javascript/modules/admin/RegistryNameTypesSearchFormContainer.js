import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams, getRegistryNameTypesQuery } from 'modules/search';
import { fetchData } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getRegistryNameTypesQuery(state),
    scope: 'registry_name_type',
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
