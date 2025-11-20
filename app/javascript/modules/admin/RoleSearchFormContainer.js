import { fetchData } from 'modules/data';
import { getRolesQuery, resetQuery, setQueryParams } from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getRolesQuery(state),
    scope: 'role',
    searchableAttributes: [
        { attributeName: 'name' },
        { attributeName: 'desc' },
    ],
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
