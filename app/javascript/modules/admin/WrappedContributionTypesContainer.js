import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams, getContributionTypesQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getContributionTypesForCurrentProject, getContributionTypesStatus, getProjectLocales,
    getProjectHasMap } from 'modules/data';
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
        data: getContributionTypesForCurrentProject(state),
        dataStatus: getContributionTypesStatus(state),
        resultPagesCount: getContributionTypesStatus(state).resultPagesCount,
        query: getContributionTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'contribution_type',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        baseTabIndex: 4 + getProjectHasMap(state),
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
        helpTextCode: 'contribution_type_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
