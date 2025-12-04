import { fetchData } from 'modules/data';
import {
    getCollectionsQuery,
    resetQuery,
    setQueryParams,
} from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getCollectionsQuery(state),
    scope: 'collection',
    searchableAttributes: [{ attributeName: 'name' }],
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            setQueryParams,
            resetQuery,
            hideSidebar,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
