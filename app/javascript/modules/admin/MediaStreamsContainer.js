import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, deleteData, submitData, getProjects,
    getCurrentUser, getMediaStreamsForCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project,
        translations: getTranslations(state),
        user: getCurrentUser(state),
        editView: true,
        //
        data: getMediaStreamsForCurrentProject(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'media_stream',
        detailsAttributes: ['path', 'media_type'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'media_type',
                elementType: 'select',
                values: ['still', 'video', 'audio'],
                withEmpty: true,
            },
            {
                attribute: 'path',
                elementType: 'input',
                help: 'help_texts.media_streams.path'
            },
            {
                attribute: 'resolution',
                elementType: 'input',
            },
        ],
        helpTextCode: 'mediapath_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
