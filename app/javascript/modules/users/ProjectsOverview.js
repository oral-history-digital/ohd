import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';
import PropTypes from 'prop-types';

export default function ProjectsOverview({ user }) {
    const { t, locale } = useI18n();
    const userProjects = Object.values(user.user_projects)
        .filter((userProject) => userProject.shortname !== 'ohd')
        .sort((a, b) =>
            `${a.name} ${a.shortname}`.localeCompare(
                `${b.name} ${b.shortname}`,
                locale
            )
        );
    const disclosureThreshold = 10;

    const capitalizeFirstLetter = (str) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

    const projectGroups = [
        {
            title: capitalizeFirstLetter(
                t('workflow_states.user_projects.project_access_requested')
            ),
            projects: userProjects.filter(
                (userProject) =>
                    userProject.workflow_state === 'project_access_requested'
            ),
        },
        {
            title: capitalizeFirstLetter(
                t('workflow_states.user_projects.project_access_granted')
            ),
            projects: userProjects.filter(
                (userProject) =>
                    userProject.workflow_state === 'project_access_granted'
            ),
        },
        {
            title: capitalizeFirstLetter(
                [
                    'project_access_rejected',
                    'project_access_blocked',
                    'project_access_terminated',
                ]
                    .map((key) => t(`workflow_states.user_projects.${key}`))
                    .join('/')
            ),
            projects: userProjects.filter(
                (userProject) =>
                    ![
                        'project_access_requested',
                        'project_access_granted',
                    ].includes(userProject.workflow_state)
            ),
            showStatus: true,
        },
    ].filter((group) => group.projects.length > 0);

    const projectDetails = (userProject, showStatus = false) => {
        const workflowState = t(
            `workflow_states.user_projects.${userProject.workflow_state}`
        );
        const dateValue =
            userProject.processed_at ||
            userProject.activated_at ||
            userProject.updated_at;
        const date = dateValue
            ? new Date(dateValue).toLocaleDateString(locale, {
                  dateStyle: 'medium',
              })
            : null;
        const details = [showStatus && workflowState, date].filter(Boolean);

        return (
            <li key={userProject.id} className="DetailList-item">
                <strong>{userProject.name}</strong> ({userProject.shortname})
                {details.length > 0 && ` - ${details.join(' - ')}`}
            </li>
        );
    };

    const projectList = (projects, showStatus) => (
        <ul className="DetailList">
            {projects.map((userProject) =>
                projectDetails(userProject, showStatus)
            )}
        </ul>
    );

    const projectGroup = (group) => {
        const list = projectList(group.projects, group.showStatus);

        return (
            <section key={group.title}>
                <h4>{group.title}</h4>
                {group.projects.length > disclosureThreshold ? (
                    <Disclosure
                        title={`${group.projects.length} ${t('activerecord.models.project.other')}`}
                    >
                        {list}
                    </Disclosure>
                ) : (
                    list
                )}
            </section>
        );
    };

    return (
        <>
            <h3>{t('modules.project_access.many')}</h3>
            {projectGroups.map((group) => projectGroup(group))}
        </>
    );
}

ProjectsOverview.propTypes = {
    user: PropTypes.shape({
        user_projects: PropTypes.object.isRequired,
    }).isRequired,
};
