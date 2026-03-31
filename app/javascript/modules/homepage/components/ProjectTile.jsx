import lockRegular from 'assets/images/lock-regular.svg';
import lockSolid from 'assets/images/lock-solid.svg';
import { PROJECT_ACCESS_REQUESTED, useProjectAccessStatus } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import { SmartImage } from 'modules/ui';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';

export function ProjectTile({ project }) {
    const { t, locale } = useI18n();
    const { projectAccessGranted, projectAccessStatus } =
        useProjectAccessStatus(project);

    const name = project.display_name || project.name;

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

    const numInterviews = formatNumber(
        project.interviews?.total || 0,
        0, // no decimal places
        locale
    );

    const interviewsStr = t(
        project.interviews?.total === 1
            ? 'activerecord.models.interview.one'
            : 'activerecord.models.interview.other',
        {
            count: project.interviews?.total || 0,
        }
    );

    return (
        <LinkOrA className="ProjectTile" project={project} to="">
            <article
                className="ProjectTile-inner"
                data-testid={`homepage-project-tile-${project.id}`}
            >
                {showLock && (
                    <div
                        className="ProjectTile-lock"
                        title={lockLabel}
                        aria-label={lockLabel}
                        data-testid={`homepage-project-tile-lock-${project.id}`}
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
                        {numInterviews} {interviewsStr}
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
