import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { setQueryParams, getCollectionsQuery } from 'modules/search';
import {
    fetchData, deleteData, submitData, getCurrentProject,
    getProjectLocales, getCurrentAccount,
    getCollectionsForCurrentProject, getCollectionsStatus
} from 'modules/data';
import { getCookie } from 'modules/persistence';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: getProjectLocales(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
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
        detailsAttributes: ['name', 'homepage', 'responsibles', 'notes'],
        initialFormValues: { project_id: project.id },
        formElements: [
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'homepage',
                multiLocale: true,
            },
            {
                attribute: 'responsibles',
                multiLocale: true,
                elementType: 'textarea',
                htmlOptions: { maxLength: 255 }
            },
            {
                attribute: 'notes',
                multiLocale: true,
                elementType: 'textarea',
            }
        ],
        joinedData: {},
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
