import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, deleteData, submitData, getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: true,
        data: project.external_links,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'external_link',
        detailsAttributes: ['name', 'url'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: "internal_name"
            },
            {
                attribute: 'name',
                multiLocale: true,
            },
            {
                attribute: 'url',
                multiLocale: true,
            },
        ],
        helpTextCode: 'external_link_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
