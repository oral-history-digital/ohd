import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getContributionTypesQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject,
    getContributionTypesForCurrentProject, getContributionTypesStatus } from 'modules/data';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        data: getContributionTypesForCurrentProject(state),
        dataStatus: getContributionTypesStatus(state),
        resultPagesCount: getContributionTypesStatus(state).resultPagesCount,
        query: getContributionTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'contribution_type',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
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
                attribute: 'display_on_landing_page',
                elementType: 'input',
                type: 'checkbox',
            },
            {
                attribute: 'use_in_export',
                elementType: 'input',
                type: 'checkbox',
            },
            {
                attribute: 'order',
            },
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
