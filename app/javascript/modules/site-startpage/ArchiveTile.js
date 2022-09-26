import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { getInstitutions } from 'modules/data';
import { LinkOrA } from 'modules/routes';

export default function ArchiveTile({
    archive
}) {
    const { t, locale } = useI18n();
    const institutions = useSelector(getInstitutions);

    const name = archive.display_name[locale] || archive.name[locale];
    const backgroundColor = archive.primary_color || '#333333';
    const opaqueBackgroundColor = backgroundColor + '40';

    let institutionName;
    const institutionProject = Object.values(archive.institution_projects)[0];
    if (institutionProject) {
        const institutionId = institutionProject?.institution_id;
        const institution = institutions[institutionId];
        institutionName = institution.name[locale];
    }

    const logoSrc = Object.values(archive.logos)[0]?.src;

    return (
        <LinkOrA
            className="ArchiveTile"
            style={{ backgroundColor: opaqueBackgroundColor }}
            project={archive}
            to=""
        >
            <article className="ArchiveTile-inner">
                <div
                    className="ArchiveTile-image"
                    style={{ backgroundImage: logoSrc ? `url(${logoSrc})` : null }}
                />
                <div className="ArchiveTile-body">
                    <h4 className="ArchiveTile-title">
                        {name}
                    </h4>
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
