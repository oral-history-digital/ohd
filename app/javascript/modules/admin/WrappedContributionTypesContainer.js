import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams, getContributionTypesQuery } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getContributionTypesForCurrentProject, getContributionTypesStatus } from 'modules/data';
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
        editView: getEditView(state),
        data: getContributionTypesForCurrentProject(state),
        dataStatus: getContributionTypesStatus(state),
        resultPagesCount: getContributionTypesStatus(state).resultPagesCount,
        query: getContributionTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'contribution_type',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        baseTabIndex: 4 + project.has_map,
        detailsAttributes: ['code'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'label',
                multiLocale: true,
            },
            {
                attribute: 'code',
                help: 'help_texts.contribution_types.code',
                validate: function(v){return /^\w+$/.test(v)}
            },
            {
                attribute: 'use_in_details_view',
                elementType: 'input',
                type: 'checkbox',
            },
            {
                attribute: 'order',
            },
            //{
                //attribute: 'use_as_speaker',
                //elementType: 'input',
                //type: 'checkbox',
            //},
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