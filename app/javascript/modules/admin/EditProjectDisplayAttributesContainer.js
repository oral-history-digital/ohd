import { connect } from 'react-redux';

import { getCurrentProject, submitData } from 'modules/data';
import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import EditData from './EditData';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        translations: getTranslations(state),
        account: state.data.accounts.current,
        editView: getEditView(state),
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
