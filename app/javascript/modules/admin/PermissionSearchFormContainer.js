import { fetchData } from 'modules/data';
import {
    getPermissionsQuery,
    resetQuery,
    setQueryParams,
} from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getPermissionsQuery(state),
    scope: 'permission',
    searchableAttributes: [
        { attributeName: 'name' },
        { attributeName: 'klass' },
        { attributeName: 'action_name' },
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
