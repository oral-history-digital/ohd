import { connect } from 'react-redux';

import { getLocale, getLocales, getProjectId, getTranslations } from 'modules/archive';
import { setQueryParams } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getLanguages } from 'modules/data';
import { getCookie } from 'modules/persistence';
import WrappedDataList from './WrappedDataList';
import { getLanguagesStatus } from '../data';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getCookie('editView') === 'true',
        data: getLanguages(state),
        dataStatus: getLanguagesStatus(state),
        resultPagesCount: getLanguagesStatus(state).resultPagesCount,
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
                multiLocale: true,
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
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
