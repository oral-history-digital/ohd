import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { findExternalLink } from 'modules/layout';

export default function RequestProjectAccessForm({
    locale,
    projectId,
    project,
    currentUser,
    submitData,
    onSubmit,
    onCancel,
    showStepTwo,
}) {

    const { t } = useI18n();
    const currentUserProject = Object.values(currentUser.user_projects).find(p => p.project_id === project.id);
    const values = {
        project_id: project.id,
        user_id: currentUser.id,
    };
    if (currentUserProject) {
        values.workflow_state = 'request_project_access';
    }

    const conditionsLink = findExternalLink(project, 'conditions');
    const tos_link = () => {
        return (
            <a href={conditionsLink[locale]} target="_blank" title="Externer Link" rel="noreferrer">
                {t('user.tos_agreement')}
            </a>
        )
    };

    const DEFAULT_FORM_ELEMENTS = {
        organization: {
            elementType: 'input',
            attribute: 'organization',
            label: t('activerecord.attributes.user.organization'),
            value: currentUser.organization,
            type: 'text',
            validate: function(v){return v?.length > 1}
        },
        job_description: {
            elementType: 'select',
            attribute: 'job_description',
            label: t('activerecord.attributes.user.job_description'),
            optionsScope: 'user_project.job_description',
            value: currentUser.job_description,
            values: Object.entries(project.access_config.job_description.values).map(([key, value]) => value && key),
            keepOrder: true,
            withEmpty: true,
            validate: function(v){return v?.length > 1}
        },
        research_intentions: {
            elementType: 'select',
            attribute: 'research_intentions',
            label: t('activerecord.attributes.user.research_intentions'),
            optionsScope: 'user_project.research_intentions',
            value: currentUser.research_intentions,
            values: Object.entries(project.access_config.research_intentions.values).map(([key, value]) => value && key),
            keepOrder: true,
            withEmpty: true,
            validate: function(v){return v?.length > 1}
        },
        specification: {
            elementType: 'textarea',
            attribute: 'specification',
            label: t('activerecord.attributes.user.specification'),
            value: currentUser.specification,
            validate: function(v){return v?.length > 10}
        },
        tos_agreement: {
            elementType: 'input',
            attribute: 'tos_agreement',
            labelKey: 'user.tos_agreement',
            type: 'checkbox',
            validate: function(v){return v && v !== '0'},
            help: t('user.notes_on_tos_agreement_archive', {
                project: project.name[locale],
                tos_link: tos_link(),
            })
        },
    };

    const formElements = [];
    Object.entries(DEFAULT_FORM_ELEMENTS).forEach(([key, value]) => {
        if (project.access_config[key].display) formElements.push(DEFAULT_FORM_ELEMENTS[key]);
    });

    if (project.has_newsletter) {
        formElements.push({
            elementType: 'input',
            attribute: 'receive_newsletter',
            type: 'checkbox',
            help: t('user_project.notes_on_receive_newsletter', {project: project.name[locale]})
        });
    }

    return (
        <>
            <h2>{(showStepTwo ? t('modules.project_access.request_step_two') : '')}{t('modules.project_access.request_title', {project: project.name[locale]})}</h2>
            <p>{t('modules.project_access.request_description')}</p>
            <Form
                scope='user_project'
                onSubmit={(params) => {
                    submitData({ locale, projectId, project }, params);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                values={ values }
                data={currentUserProject}
                submitText='modules.project_access.request_submit'
                elements={formElements}
            />
        </>
    );
}

RequestProjectAccessForm.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
