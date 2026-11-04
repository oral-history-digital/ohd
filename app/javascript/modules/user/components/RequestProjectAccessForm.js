import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

import useProjectAccessConfig from '../useProjectAccessConfig';

/**
 * Displays the form for requesting project access after loading the project's access settings.
 *
 * @param {Object} props - Request form properties.
 * @param {string} props.projectId - Project shortname used by the existing save flow.
 * @param {Object} props.currentUser - Account requesting access.
 * @param {Function} props.submitData - Existing request submission action.
 * @param {Function} [props.onSubmit] - Called after starting submission.
 * @param {Function} [props.onCancel] - Closes the form without submitting.
 * @param {boolean} [props.showStepTwo] - Shows the registration step heading.
 * @returns {React.ReactElement} Request form, loading indicator, or persistent error.
 */
export default function RequestProjectAccessForm({
    projectId,
    currentUser,
    submitData,
    onSubmit,
    onCancel,
    showStepTwo,
}) {
    const { t, locale } = useI18n();
    const { project, projectDbId, error, isLoading, isValidating } = useProject(
        {
            include: ['access_config'],
        }
    );
    const currentUserProject = Object.values(
        currentUser.user_projects || {}
    ).find((p) => p.project_id === projectDbId);
    const formElements = useProjectAccessConfig(
        project,
        currentUserProject,
        currentUser
    );

    if (error || (!isLoading && !project?.access_config))
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error?.message}
                isClosable={false}
            />
        );
    if (isLoading) return <Spinner />;

    const values = {
        project_id: project.id,
        user_id: currentUser.id,
        pre_access_location: location.href,
    };
    if (currentUserProject) {
        values.workflow_state = 'request_project_access';
    }

    if (project.has_newsletter) {
        formElements.push({
            elementType: 'input',
            attribute: 'receive_newsletter',
            type: 'checkbox',
            help: t('user_project.notes_on_receive_newsletter', {
                project: project.name,
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
                    project: project.name,
                })}
            </h2>
            <p>{t('modules.project_access.request_description')}</p>
            <Form
                scope="user_project"
                fetching={isValidating}
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
    projectId: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    showStepTwo: PropTypes.bool,
};
