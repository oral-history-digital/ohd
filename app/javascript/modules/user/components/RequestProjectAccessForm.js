import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import findExternalLink from '../findExternalLink';

export default function RequestProjectAccessForm({
    externalLinks,
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

    const conditionsLink = findExternalLink(project, 'conditions');
    const privacyLink = findExternalLink(project, 'privacy_protection');

    return (
        <>
            <h2>{(showStepTwo ? t('modules.request_project_access.step_two') : '') + t('modules.request_project_access.title', {project: project.name[locale]})}</h2>
            <p>{t('modules.request_project_access.description')}</p>
            <Form
                scope='user_project'
                onSubmit={(params) => {
                    submitData({ locale, projectId, project }, params);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                values={{
                    project_id: project.id,
                    user_id: currentUser.id,
                }}
                submitText='modules.request_project_access.submit'
                elements={[
                    {
                        elementType: 'input',
                        attribute: 'organization',
                        value: currentUser.organization,
                        type: 'text',
                        validate: function(v){return v?.length > 1}
                    },
                    {
                        elementType: 'select',
                        attribute: 'job_description',
                        value: currentUser.job_description,
                        values: ['researcher', 'filmmaker', 'journalist', 'teacher', 'memorial_staff', 'pupil', 'student', 'other'],
                        keepOrder: true,
                        withEmpty: true,
                        validate: function(v){return v?.length > 1}
                    },
                    {
                        elementType: 'select',
                        attribute: 'research_intentions',
                        value: currentUser.research_intentions,
                        values: ['exhibition', 'education', 'film', 'genealogy', 'art', 'personal_interest', 'press_publishing', 'school_project', 'university_teaching', 'scientific_paper', 'other'],
                        keepOrder: true,
                        withEmpty: true,
                        validate: function(v){return v?.length > 1}
                    },
                    {
                        elementType: 'textarea',
                        attribute: 'specification',
                        value: currentUser.specification,
                        validate: function(v){return v?.length > 10}
                    },
                    {
                        elementType: 'input',
                        attribute: 'tos_agreement',
                        labelKey: 'user.tos_agreement',
                        type: 'checkbox',
                        validate: function(v){return v && v !== '0'},
                        help: (
                            <a href={conditionsLink[locale]} target="_blank" title="Externer Link" rel="noreferrer">
                                {t('user.notes_on_tos_agreement')}
                            </a>
                        )
                    },
                    {
                        elementType: 'input',
                        attribute: 'receive_newsletter',
                        type: 'checkbox',
                        help: (
                            <p>
                                {t('user_project.notes_on_receive_newsletter', {project: project.name[locale]})}
                            </p>
                        )
                    },
                ]}
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
