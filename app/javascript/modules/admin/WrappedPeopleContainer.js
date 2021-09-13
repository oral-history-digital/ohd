import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams, getPeopleQuery } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getPeopleForCurrentProject, getPeopleStatus, getProjectLocales, getProjectHasMap } from 'modules/data';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: getProjectLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        data: getPeopleForCurrentProject(state),
        dataStatus: getPeopleStatus(state),
        resultPagesCount: getPeopleStatus(state).resultPagesCount,
        query: getPeopleQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'person',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        baseTabIndex: 4 + getProjectHasMap(state),
        //detailsAttributes: ['name'],
        detailsAttributes: ['first_name', 'last_name', 'birth_name', 'alias_names', 'other_first_names', 'date_of_birth', 'typology'],
        initialFormValues: {project_id: project.id},
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
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'last_name',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'birth_name',
                multiLocale: true,
            },
            {
                attribute: 'alias_names',
                multiLocale: true,
            },
            {
                attribute: 'other_first_names',
                multiLocale: true,
            },
            {
                attribute: 'date_of_birth',
            },
        ],
        joinedData: { },
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
