import { getCurrentProject, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditData from './EditData';

const mapStateToProps = (state) => {
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
                'memorial_culture_project',
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
    };

    if (project) {
        Object.entries(DEFAULT_FORM_ELEMENTS).forEach(([attribute, value]) => {
            formElements.push({
                elementType: 'extra',
                tag: 'h3',
                labelKey: `activerecord.attributes.user.${attribute}`,
            });
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]display`,
                labelKey: 'edit.default.display',
                value:
                    String(
                        project.access_config[attribute].display
                    ).toLowerCase() === 'true',
                type: 'checkbox',
            });
            formElements.push({
                elementType: 'input',
                attribute: `[${attribute}_setter]obligatory`,
                labelKey: 'edit.default.obligatory',
                value:
                    String(
                        project.access_config[attribute].obligatory
                    ).toLowerCase() === 'true',
                type: 'checkbox',
            });
            if (DEFAULT_FORM_ELEMENTS[attribute].values) {
                DEFAULT_FORM_ELEMENTS[attribute].values.map((value) => {
                    formElements.push({
                        elementType: 'input',
                        attribute: `[${attribute}_setter][values]${value}`,
                        labelKey: `user_project.${attribute}.${value}`,
                        className: 'is-option',
                        value:
                            String(
                                project.access_config[attribute].values[value]
                            ).toLowerCase() === 'true',
                        type: 'checkbox',
                    });
                });
            }
        });
    }

    return {
        data: project.access_config,
        scope: 'access_config',
        helpTextCode: 'access_config_form',
        formElements: formElements,
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
