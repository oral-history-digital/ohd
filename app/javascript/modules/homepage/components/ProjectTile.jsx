import lockRegular from 'assets/images/lock-regular.svg';
import lockSolid from 'assets/images/lock-solid.svg';
import { PROJECT_ACCESS_REQUESTED, useProjectAccessStatus } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import { SmartImage } from 'modules/ui';
import PropTypes from 'prop-types';

export function ProjectTile({ project }) {
    const { t } = useI18n();
    const { projectAccessGranted, projectAccessStatus } =
        useProjectAccessStatus(project);

    const name = project.display_name || project.name;
    const backgroundColor = project.primary_color || '#333333';
    const opaqueBackgroundColor = backgroundColor + '40';

    const institutionName = project.institutions
        ?.map((institution) => institution.name)
        .filter(Boolean)
        .join(', ');

    const logoSrc = project.logo?.url;
    const showLock = !projectAccessGranted;
    const lockIconSrc =
        projectAccessStatus === PROJECT_ACCESS_REQUESTED
            ? lockRegular
            : lockSolid;
    const lockLabel =
        projectAccessStatus === PROJECT_ACCESS_REQUESTED
            ? t('modules.site_startpage.access_requested')
            : t('modules.site_startpage.no_access');

    return (
        <LinkOrA
            className="ProjectTile"
            style={{ backgroundColor: opaqueBackgroundColor }}
            project={project}
            to=""
        >
            <article className="ProjectTile-inner">
                {showLock && (
                    <div
                        className="ProjectTile-lock"
                        title={lockLabel}
                        aria-label={lockLabel}
                    >
                        <img
                            src={lockIconSrc}
                            className="ProjectTile-lockImg"
                            alt=""
                        />
                    </div>
                )}

                <SmartImage
                    src={logoSrc}
                    alt={name}
                    className="ProjectTile-image"
                    objectFit="contain"
                />

                <div className="ProjectTile-body">
                    <h4 className="ProjectTile-title">{name}</h4>
                    <p className="ProjectTile-text ProjectTile-text--ellipsis">
                        {institutionName}
                    </p>
                    <p className="ProjectTile-text">
                        {project.interviews?.total || 0} Interviews
                    </p>
                </div>
            </article>
        </LinkOrA>
    );
}

export default ProjectTile;

ProjectTile.propTypes = {
    project: PropTypes.object.isRequired,
};
