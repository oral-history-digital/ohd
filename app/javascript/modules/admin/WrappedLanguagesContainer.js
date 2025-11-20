import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getLanguagesQuery } from 'modules/search';
import {
    fetchData,
    deleteData,
    submitData,
    getLanguages,
    getLanguagesStatus,
} from 'modules/data';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => ({
    data: getLanguages(state),
    dataStatus: getLanguagesStatus(state),
    resultPagesCount: getLanguagesStatus(state).resultPagesCount,
    query: getLanguagesQuery(state),
    scope: 'language',
    detailsAttributes: ['code', 'name'],
    formElements: [
        {
            attribute: 'code',
            validate: function (v) {
                return /^[a-z]+$/.test(v);
            },
        },
        {
            attribute: 'name',
            multiLocale: true,
        },
    ],
    joinedData: {},
    helpTextCode: 'language_form',
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
            setQueryParams,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
