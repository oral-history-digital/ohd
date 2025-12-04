import {
    deleteData,
    fetchData,
    getCurrentProject,
    getMediaStreamsForCurrentProject,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataList from './DataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        editView: true,
        data: getMediaStreamsForCurrentProject(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'media_stream',
        detailsAttributes: ['path', 'media_type'],
        initialFormValues: { project_id: project.id },
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
                help: 'help_texts.media_streams.path',
            },
            {
                attribute: 'resolution',
                elementType: 'input',
            },
        ],
        helpTextCode: 'mediapath_form',
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
