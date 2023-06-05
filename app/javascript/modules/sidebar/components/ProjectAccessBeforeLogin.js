import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function ProjectAccessBeforeLogin({
    className,
}) {
    const { t } = useI18n();

    const project = useProject();

    let projectAccessMessage;
    if (project.is_ohd) {
        projectAccessMessage = t('modules.registration.registration_needed_ohd');
    } else if (project.grant_access_without_login) {
        projectAccessMessage = '';
    } else if (project.grant_project_access_instantly) {
        projectAccessMessage = t('modules.registration.registration_needed_archive');
    } else {
        projectAccessMessage = t('modules.registration.registration_and_access_needed');
    }

    return (
        <div className={classNames(className)}>
            {projectAccessMessage}
        </div>
    );
}

ProjectAccessBeforeLogin.propTypes = {
    className: PropTypes.string,
};
