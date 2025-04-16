import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getTranslationValuesQuery } from 'modules/search';
import { fetchData, deleteData, submitData,
    getTranslationValues, getTranslationValuesStatus } from 'modules/data';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = state => ({
    data: getTranslationValues(state),
    dataStatus: getTranslationValuesStatus(state),
    resultPagesCount: getTranslationValuesStatus(state).resultPagesCount,
    query: getTranslationValuesQuery(state),
    scope: 'translation_value',
    detailsAttributes: ['key', 'value'],
    formElements: [
        {
            attribute: 'key',
            validate: function(v){return /^[A-Za-z1-9\.\_\-]+$/.test(v)}
        },
        {
            attribute: 'value',
            multiLocale: true,
        },
    ],
    joinedData: { },
    helpTextCode: 'translation_value_form'
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
