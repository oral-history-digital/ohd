import lockRegular from 'assets/images/lock-regular.svg';
import lockSolid from 'assets/images/lock-solid.svg';
import { PROJECT_ACCESS_REQUESTED, useProjectAccessStatus } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { LinkOrA } from 'modules/routes';
import { SmartImage } from 'modules/ui';
import PropTypes from 'prop-types';

export function ArchiveTile({ archive }) {
    const { t } = useI18n();
    const { projectAccessGranted, projectAccessStatus } =
        useProjectAccessStatus(archive);

    const name = archive.display_name || archive.name;
    const backgroundColor = archive.primary_color || '#333333';
    const opaqueBackgroundColor = backgroundColor + '40';

    const institutionName = archive.institutions
        ?.map((institution) => institution.name)
        .filter(Boolean)
        .join(', ');

    const logoSrc = archive.logo?.url;
    const showLock =
        archive.workflow_state !== 'public' && !projectAccessGranted;
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

                <SmartImage
                    src={logoSrc}
                    alt={name}
                    className="ArchiveTile-image"
                    objectFit="contain"
                />

                <div className="ArchiveTile-body">
                    <h4 className="ArchiveTile-title">{name}</h4>
                    <p className="ArchiveTile-text ArchiveTile-text--ellipsis">
                        {institutionName}
                    </p>
                    <p className="ArchiveTile-text">
                        {archive.interviews?.total || 0} Interviews
                    </p>
                </div>
            </article>
        </LinkOrA>
    );
}

export default ArchiveTile;

ArchiveTile.propTypes = {
    archive: PropTypes.object.isRequired,
};
