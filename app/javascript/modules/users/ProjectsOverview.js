import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function ProjectsOverview({ user }) {
    const { t, locale } = useI18n();
    const projects = useSelector(getProjects);
    const userProjects = Object.values(user.user_projects);

    const [showProject, setShowProject] = useState('');

    const projectDisplay = (userProject) => {
        const workflowState = t(
            `workflow_states.user_projects.${userProject.workflow_state}`
        );
        const project = projects[userProject.project_id];

        if (project.is_ohd) {
            return null;
        }

        const date = new Date(
            userProject.processed_at ||
                userProject.activated_at ||
                userProject.updated_at
        ).toLocaleDateString(locale, { dateStyle: 'medium' });
        return (
            <li key={userProject.id} className="DetailList-item">
                <h4
                    onClick={() =>
                        setShowProject(
                            showProject === project.shortname
                                ? ''
                                : project.shortname
                        )
                    }
                >
                    {project.shortname}
                </h4>
                <div
                    className={
                        showProject === project.shortname ? '' : 'hidden'
                    }
                >
                    <p>
                        {t('modules.project_access.actual_workflow_state') +
                            ': ' +
                            workflowState}
                    </p>
                    <p>{t('modules.project_access.at') + ': ' + date}</p>
                </div>
            </li>
        );
    };

    return (
        <>
            <h3>{t('modules.project_access.many')}</h3>
            <ul className="DetailList">
                {userProjects.map((urp) => projectDisplay(urp))}
            </ul>
        </>
    );
}

ProjectsOverview.propTypes = {
    row: PropTypes.object.isRequired,
};
