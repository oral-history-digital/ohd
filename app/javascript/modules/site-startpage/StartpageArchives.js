import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getStartpageProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import ArchiveTile from './ArchiveTile';

const INITIALLY_SHOWN_ARCHIVES = 6;

export default function StartpageArchives({
    className
}) {
    const archives = useSelector(getStartpageProjects);
    const [showMore, setShowMore] = useState(false);
    const { t } = useI18n();

    const shownArchives = showMore ?
        archives :
        archives.slice(0, INITIALLY_SHOWN_ARCHIVES);

    const displayShowMoreButton = archives.length > INITIALLY_SHOWN_ARCHIVES;

    return (
        <article className={className}>
            <h3 className="Startpage-heading u-mt-none u-mb-none">
                {t('modules.site_startpage.sample_archives')}
            </h3>

            <div className="Grid u-mt">
                {shownArchives.map(archive => (
                    <ArchiveTile
                        key={archive.id}
                        archive={archive}
                    />
                ))}
            </div>

            {!showMore && displayShowMoreButton && (
                <div className="u-align-center u-mt-large">
                    <button
                        type="button"
                        className="Button Button--transparent Button--primaryColor"
                        onClick={() => setShowMore(true)}
                    >
                        {t('modules.site_startpage.more_results')}
                    </button>
                </div>
            )}
        </article>
    )
}

StartpageArchives.propTypes = {
    className: PropTypes.string,
};
