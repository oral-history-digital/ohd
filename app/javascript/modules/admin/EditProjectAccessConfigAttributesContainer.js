import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getProjectLocales, submitData, getCurrentProject, getCurrentUser } from 'modules/data';
import { getTranslations, getEditView } from 'modules/archive';
import EditData from './EditData';

const mapStateToProps = state => {
    const project = getCurrentProject(state);
    const formElements = [];
    const DEFAULT_FORM_ELEMENTS = [
        'organization',
        'job_description',
        'research_intentions',
        'specification',
        'tos_agreement',
    ];

    if (project) {
        DEFAULT_FORM_ELEMENTS.forEach(attribute => {
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}]display`,
                value: project.access_config[attribute].display,
                type: "checkbox"
            });
            if (project.access_config[attribute].values) {
                Object.entries(project.access_config[attribute].values).map(([key, value]) => {
                formElements.push({
                    elementType: 'input',
                    attribute: `[${attribute}][values]${key}`,
                    value: value,
                    type: "checkbox"
                });
            })};
        });
    }


    return {
        locales: getProjectLocales(state),
        translations: getTranslations(state),
        user: getCurrentUser(state),
        editView: getEditView(state),
        data: project.access_config,
        scope: 'access_config',
        helpTextCode: 'access_config_form',
        formElements: formElements,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditData);

