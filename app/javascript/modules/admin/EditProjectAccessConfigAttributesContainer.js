import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getProjectLocales, submitData, getCurrentProject, getCurrentUser } from 'modules/data';
import { getTranslations, getEditView } from 'modules/archive';
import EditData from './EditData';

const mapStateToProps = state => {
    const project = getCurrentProject(state);
    const formElements = [];
    const DEFAULT_FORM_ELEMENTS = {
        organization: {},
        job_description: {
            values: [
                'researcher',
                'filmmaker',
                'journalist',
                'teacher',
                'memorial_staff',
                'pupil',
                'student',
                'other',
            ],
        },
        research_intentions: {
            values: [
                'exhibition',
                'education',
                'film',
                'genealogy',
                'art',
                'personal_interest',
                'press_publishing',
                'school_project',
                'university_teaching',
                'scientific_paper',
                'other',
            ],
        },
        specification: {},
        tos_agreement: {},
    }

    if (project) {
        Object.entries(DEFAULT_FORM_ELEMENTS).forEach(([attribute, value]) => {
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]display`,
                labelKey: `activerecord.attributes.user.${attribute}`,
                value: project.access_config[attribute].display,
                type: "checkbox"
            });
            if (DEFAULT_FORM_ELEMENTS[attribute].values) {
                DEFAULT_FORM_ELEMENTS[attribute].values.map(value => {
                formElements.push({
                    elementType: 'input',
                    attribute: `[${attribute}_setter][values]${value}`,
                    labelKey: `user_project.${attribute}.${value}`,
                    value: project.access_config[attribute].values[value],
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

