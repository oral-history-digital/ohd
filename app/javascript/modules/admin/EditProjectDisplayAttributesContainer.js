import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import EditData from './EditData';
import { submitData } from 'modules/data';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: project,
        scope: 'project',
        formElements: [
            {
                attribute: "primary_color",
            },
            {
                attribute: "secondary_color",
            },
            {
                attribute: "editorial_color",
            },
            {
                attribute: "aspect_x",
                validate: function(v){return /^\d+$/.test(v)}
            },
            {
                attribute: "aspect_y",
                validate: function(v){return /^\d+$/.test(v)}
            },
        ],
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
