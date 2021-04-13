import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getLocales, getProjectId, getTranslations } from 'modules/archive';
import { setQueryParams, getCollectionsQuery } from 'modules/search';
import { openArchivePopup, closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getCollections, getCollectionsStatus } from 'modules/data';
import { getCookie } from 'modules/persistence';
import WrappedDataList from './WrappedDataList';

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
        data: getCollections(state),
        dataStatus: getCollectionsStatus(state),
        resultPagesCount: getCollectionsStatus(state).resultPagesCount,
        query: getCollectionsQuery(state),
        scope: 'collection',
        baseTabIndex: 4 + project.has_map,
        //detailsAttributes: ['name'],
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
                attribute: 'institution',
                multiLocale: true,
                //validate: function(v){return v.length > 1}
            },
            {
                attribute: 'responsibles',
                multiLocale: true,
            },
            {
                attribute: 'notes',
                multiLocale: true,
            },
            {
                attribute: 'countries',
                multiLocale: true,
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
    openArchivePopup,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
