import { connect } from 'react-redux';

import WrappedDataList from '../components/WrappedDataList';
import { setQueryParams } from '../actions/searchActionCreators';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData, submitData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: state.data.people,
        dataStatus: state.data.statuses.people,
        resultPagesCount: state.data.statuses.people.resultPagesCount,
        query: state.search.people.query,
        scope: 'person',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        baseTabIndex: 4,
        //detailsAttributes: ['name'],
        detailsAttributes: ['first_name', 'last_name', 'birth_name', 'alias_names', 'other_first_names', 'date_of_birth', 'typology'],
        formElements: [
            {
                elementType: 'select',
                attribute: 'gender',
                values: ['male', 'female', 'diverse'],
                optionsScope: 'gender',
                withEmpty: true,
                //validate: function(v){return v !== ''} 
            },
            {
                attribute: 'first_name',
                elementType: 'multiLocaleInput',
                //validate: function(v){return v.length > 1} 
            },
            {
                attribute: 'last_name',
                elementType: 'multiLocaleInput',
                //validate: function(v){return v.length > 1} 
            },
            {
                attribute: 'birth_name',
                elementType: 'multiLocaleInput',
            },
            {
                attribute: 'alias_names',
                elementType: 'multiLocaleInput',
            },
            {
                attribute: 'other_first_names',
                elementType: 'multiLocaleInput',
            },
            { 
                attribute: 'date_of_birth',
            },
        ],
        joinedData: { },
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
