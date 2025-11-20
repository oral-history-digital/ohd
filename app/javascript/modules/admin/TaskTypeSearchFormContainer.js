import { fetchData } from 'modules/data';
import { getTaskTypesQuery, resetQuery, setQueryParams } from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getTaskTypesQuery(state),
    scope: 'task_type',
    searchableAttributes: [{ attributeName: 'label' }],
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
