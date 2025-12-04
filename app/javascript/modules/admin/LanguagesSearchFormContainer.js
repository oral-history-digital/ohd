import { fetchData } from 'modules/data';
import { getLanguagesQuery, resetQuery, setQueryParams } from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getLanguagesQuery(state),
    scope: 'language',
    searchableAttributes: [
        { attributeName: 'name' },
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
