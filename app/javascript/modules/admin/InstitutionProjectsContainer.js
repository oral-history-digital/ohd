import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, getInstitutions, fetchData, deleteData, submitData, getProjects, getCurrentUser } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        user: getCurrentUser(state),
        editView: true,
        data: project.institution_projects,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'institution_project',
        detailsAttributes: ['name', 'shortname'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'institution_id',
                elementType: 'select',
                values: getInstitutions(state),
                withEmpty: true,
            },
        ],
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
