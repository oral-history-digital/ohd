import { fetchData } from 'modules/data';
import {
    getTranslationValuesQuery,
    resetQuery,
    setQueryParams,
} from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getTranslationValuesQuery(state),
    scope: 'translation_value',
    searchableAttributes: [
        { attributeName: 'key' },
        { attributeName: 'value' },
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
