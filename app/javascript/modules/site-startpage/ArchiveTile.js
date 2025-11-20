import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { useProjectAccessStatus, PROJECT_ACCESS_REQUESTED } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { getInstitutions } from 'modules/data';
import { LinkOrA } from 'modules/routes';
import lockRegular from 'assets/images/lock-regular.svg';
import lockSolid from 'assets/images/lock-solid.svg';

export default function ArchiveTile({ archive }) {
    const { t, locale } = useI18n();
    const institutions = useSelector(getInstitutions);
    const { projectAccessGranted, projectAccessStatus } =
        useProjectAccessStatus(archive);

    const name = archive.display_name[locale] || archive.name[locale];
    const backgroundColor = archive.primary_color || '#333333';
    const opaqueBackgroundColor = backgroundColor + '40';

    let institutionName;
    const institutionProjectId = archive.institution_project_ids?.[0];
    if (institutionProjectId) {
        const institution = institutions[institutionId];
        institutionName = institution.name[locale];
    }

    const logoSrc = Object.values(archive.logos)[0]?.src;
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
            className="ArchiveTile"
            style={{ backgroundColor: opaqueBackgroundColor }}
            project={archive}
            to=""
        >
            <article className="ArchiveTile-inner">
                {showLock && (
                    <div
                        className="ArchiveTile-lock"
                        title={lockLabel}
                        aria-label={lockLabel}
                    >
                        <img
                            src={lockIconSrc}
                            className="ArchiveTile-lockImg"
                            alt=""
                        />
                    </div>
                )}

                <div
                    className="ArchiveTile-image"
                    style={{
                        backgroundImage: logoSrc ? `url(${logoSrc})` : null,
                    }}
                />

                <div className="ArchiveTile-body">
                    <h4 className="ArchiveTile-title">{name}</h4>
                    <p className="ArchiveTile-text ArchiveTile-text--ellipsis">
                        {institutionName}
                    </p>
                    <p className="ArchiveTile-text">
                        {archive.num_interviews} Interviews
                    </p>
                </div>
            </article>
        </LinkOrA>
    );
}

ArchiveTile.propTypes = {
    archive: PropTypes.object.isRequired,
};
