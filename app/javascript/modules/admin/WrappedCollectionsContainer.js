import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { setQueryParams, getCollectionsQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject, getProjectLocales, getProjects, getCurrentAccount,
    getCollectionsForCurrentProject, getCollectionsStatus, getInstitutions } from 'modules/data';
import { getCookie } from 'modules/persistence';
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
        editView: getCookie('editView') === 'true',
        data: getCollectionsForCurrentProject(state),
        dataStatus: getCollectionsStatus(state),
        resultPagesCount: getCollectionsStatus(state).resultPagesCount,
        query: getCollectionsQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'collection',
        baseTabIndex: 4 + project.has_map,
        detailsAttributes: ['name', 'homepage', 'institution', 'responsibles', 'notes', 'countries'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'homepage',
                multiLocale: true,
                //validate: function(v){return /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(v)},
            },
            {
                attribute: 'institution_id',
                elementType: 'select',
                values: getInstitutions(state),
                withEmpty: true,
            },
            {
                attribute: 'responsibles',
                multiLocale: true,
            },
            {
                attribute: 'notes',
                multiLocale: true,
                elementType: 'textarea',
            },
            {
                attribute: 'countries',
                multiLocale: true,
            },
        ],
        joinedData: { },
        helpTextCode: 'collection_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
