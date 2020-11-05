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
        editView: getCookie('editView') === 'true',
        data: state.data.languages,
        dataStatus: state.data.statuses.languages,
        resultPagesCount: state.data.statuses.languages.resultPagesCount,
        query: state.search.languages.query,
        scope: 'language',
        baseTabIndex: 4 + project.has_map,
        //detailsAttributes: ['name'],
        detailsAttributes: ['code', 'name'],
        formElements: [
            {
                attribute: 'code',
                validate: function(v){return /^[a-z]+$/.test(v)}
            },
            {
                attribute: 'name',
                elementType: 'multiLocaleInput',
                //validate: function(v){return v.length > 1}
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
