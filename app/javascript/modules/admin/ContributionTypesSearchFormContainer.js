import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    resetQuery,
    setQueryParams,
    getContributionTypesQuery,
} from 'modules/search';
import { fetchData } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getContributionTypesQuery(state),
    scope: 'contribution_type',
    searchableAttributes: [
        { attributeName: 'label' },
        { attributeName: 'code' },
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
