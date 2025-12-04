import { fetchData } from 'modules/data';
import {
    getContributionTypesQuery,
    resetQuery,
    setQueryParams,
} from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
