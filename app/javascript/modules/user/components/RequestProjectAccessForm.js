import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import useProjectAccessConfig from '../useProjectAccessConfig';

export default function RequestProjectAccessForm({
    projectId,
    project,
    currentUser,
    submitData,
    onSubmit,
    onCancel,
    showStepTwo,
}) {
    const { t, locale } = useI18n();
    const currentUserProject = Object.values(currentUser.user_projects).find(
        (p) => p.project_id === project.id
    );
    const values = {
        project_id: project.id,
        user_id: currentUser.id,
        pre_access_location: location.href,
    };
    if (currentUserProject) {
        values.workflow_state = 'request_project_access';
    }

    const formElements = useProjectAccessConfig(
        project,
        currentUserProject,
        currentUser
    );

    if (project.has_newsletter) {
        formElements.push({
            elementType: 'input',
            attribute: 'receive_newsletter',
            type: 'checkbox',
            help: t('user_project.notes_on_receive_newsletter', {
                project: project.name[locale],
            }),
        });
    }

    return (
        <>
            <h2>
                {showStepTwo
                    ? t('modules.project_access.request_step_two')
                    : ''}
                {t('modules.project_access.request_title', {
                    project: project.name[locale],
                })}
            </h2>
            <p>{t('modules.project_access.request_description')}</p>
            <Form
                scope="user_project"
                onSubmit={(params) => {
                    submitData({ locale, projectId, project }, params);
                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                values={values}
                data={currentUserProject}
                submitText="modules.project_access.request_submit"
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
