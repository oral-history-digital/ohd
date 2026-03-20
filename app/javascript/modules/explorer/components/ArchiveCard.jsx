import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useScrollToExpandedCard, useSelectableHeaderToggle } from '../hooks';
import { highlightQueryInHtml } from '../utils';
import { CollectionList } from './CollectionList';
import { HighlightText } from './HighlightText';

export function ArchiveCard({ archive, query, expanded, onToggle }) {
    const cardRef = useScrollToExpandedCard(expanded);
    const { t, locale } = useI18n();
    const navigate = useNavigate();
    const institutionNames = archive.institutions
        ?.map((inst) => inst.name)
        .join(', ');
    const { handleHeaderClick, handleHeaderKeyDown } =
        useSelectableHeaderToggle(onToggle);

    const archiveUrl = archive.archive_domain
        ? archive.archive_domain
        : `/${archive.shortname}/${locale}`;

    return (
        <div
            ref={cardRef}
            className={classNames('ArchiveCard', {
                'ArchiveCard--expanded': expanded,
            })}
        >
            <div
                className="ArchiveCard-header"
                onClick={handleHeaderClick}
                onKeyDown={handleHeaderKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
            >
                <span className="ArchiveCard-chevron">
                    {expanded ? <FaMinus /> : <FaPlus />}
                </span>

                <div className="ArchiveCard-headerContent">
                    <h3 className="ArchiveCard-title">
                        <HighlightText
                            text={archive.display_name || archive.name}
                            query={query}
                        />
                    </h3>
                    <div className="ArchiveCard-meta">
                        {institutionNames && (
                            <span className="ArchiveCard-metaItem">
                                <HighlightText
                                    text={institutionNames}
                                    query={query}
                                />
                            </span>
                        )}
                        <span className="ArchiveCard-metaItem">
                            {archive.collections?.total || 0}{' '}
                            {t('explorer.collections')}
                        </span>
                        <span className="ArchiveCard-metaItem">
                            {archive.interviews?.total || 0}{' '}
                            {t('explorer.interviews')}
                        </span>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="ArchiveCard-body">
                    {archive.introduction && (
                        <div
                            className="ArchiveCard-description"
                            dangerouslySetInnerHTML={{
                                __html: highlightQueryInHtml(
                                    archive.introduction,
                                    query,
                                    'RICH_TEXT'
                                ),
                            }}
                        />
                    )}

                    {/* TODO: Replace by interview languages (needs API change) */}
                    <div className="ArchiveCard-details">
                        {archive.available_locales?.length > 0 && (
                            <span className="ArchiveCard-detailItem">
                                {t('explorer.languages')}:{' '}
                                {archive.available_locales
                                    .map((l) => l.toUpperCase())
                                    .join(', ')}
                            </span>
                        )}
                    </div>
                    <div className="ArchiveCard-pageButton">
                        <Button
                            buttonText={t('explorer.view_archive_details')}
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    `/${locale}/catalog/archives/${archive.id}`
                                )
                            }
                        />
                        <Button
                            buttonText={t('explorer.view_archive_page')}
                            variant="contained"
                            onClick={() => navigate(archiveUrl)}
                            endIcon={<FaExternalLinkAlt />}
                        />
                    </div>

                    <CollectionList archive={archive} query={query} />
                </div>
            )}
        </div>
    );
}

export default ArchiveCard;

ArchiveCard.propTypes = {
    archive: PropTypes.object.isRequired,
    query: PropTypes.string,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
};
