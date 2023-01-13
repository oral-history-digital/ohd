import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, getProjectLocales, submitData, getProjects, getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import EditData from './EditData';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
    data: getCurrentProject(state),
    scope: 'project',
    helpTextCode: 'archive_display_form',
    formElements: [
        {
            attribute: "primary_color",
            elementType: 'colorPicker',
        },
        {
            attribute: "secondary_color",
            elementType: 'colorPicker',
        },
        {
            attribute: "editorial_color",
            elementType: 'colorPicker',
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
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
