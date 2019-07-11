import { connect } from 'react-redux';

import DataSearchForm from '../components/DataSearchForm';
import { 
    resetQuery, 
    setQueryParams, 
} from '../actions/searchActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return {
        translations: state.archive.translations,
        locale: state.archive.locale,
        query: state.search.user_registrations.query,
        dataStatus: state.data.statuses.user_registrations,
        scope: 'user_registration',
        searchableAttributes: [
            {attributeName: 'first_name'}, 
            {attributeName: 'last_name'}, 
            {attributeName: 'email'}, 
            {
                attributeName: 'default_locale', 
                type: 'select',
                values: state.archive.locales,
            },
            {attributeName: 'workflow_state', type: 'select', values: ['all', 'unchecked', 'checked', 'registered', 'postponed', 'rejected']}
        ]
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
