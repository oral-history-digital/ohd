import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { resetQuery, setQueryParams, getTranslationValuesQuery } from 'modules/search';
import { fetchData } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getTranslationValuesQuery(state),
    scope: 'translation_value',
    searchableAttributes: [
        {attributeName: 'key'},
        {attributeName: 'value'},
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setQueryParams,
    resetQuery,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
