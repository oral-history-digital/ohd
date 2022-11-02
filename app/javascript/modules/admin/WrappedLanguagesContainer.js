import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { setQueryParams, getLanguagesQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getProjects, getCurrentAccount,
    getLanguages, getLanguagesStatus, getProjectLocales, getProjectHasMap } from 'modules/data';
import { getCookie } from 'modules/persistence';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getCookie('editView') === 'true',
    data: getLanguages(state),
    dataStatus: getLanguagesStatus(state),
    resultPagesCount: getLanguagesStatus(state).resultPagesCount,
    query: getLanguagesQuery(state),
    scope: 'language',
    baseTabIndex: 4 + getProjectHasMap(state),
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
    helpTextCode: 'language_form'
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
