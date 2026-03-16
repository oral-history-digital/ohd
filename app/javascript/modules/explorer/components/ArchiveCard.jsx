import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { isEmptyHtml, sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useMatch, useNavigate } from 'react-router-dom';

import { useScrollToExpandedCard, useSelectableHeaderToggle } from '../hooks';
import { CollectionList } from './CollectionList';
import { HighlightText } from './HighlightText';

export function ArchiveCard({ archive, query, expanded, onToggle }) {
    const cardRef = useScrollToExpandedCard(expanded);
    const { t } = useI18n();
    const navigate = useNavigate();
    const match = useMatch('/:locale/*');
    const locale = match?.params?.locale || 'de';
    const institutionNames = archive.institutions
        ?.map((inst) => inst.name)
        .join(', ');
    const { handleHeaderClick, handleHeaderKeyDown } =
        useSelectableHeaderToggle(onToggle);

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
                        {archive.publication_date && (
                            <span className="ArchiveCard-metaItem">
                                {archive.publication_date}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="ArchiveCard-body">
                    {archive.introduction && (
                        <div
                            className="ArchiveCard-description"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(archive.introduction),
                            }}
                        />
                    )}

                    {archive.more_text && !isEmptyHtml(archive.more_text) && (
                        <div
                            className="ArchiveCard-moreText"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(archive.more_text),
                            }}
                        />
                    )}

                    <div className="ArchiveCard-details">
                        {archive.available_locales?.length > 0 && (
                            <span className="ArchiveCard-detailItem">
                                {t('explorer.languages')}:{' '}
                                {archive.available_locales
                                    .map((l) => l.toUpperCase())
                                    .join(', ')}
                            </span>
                        )}
                        {archive.publication_date && (
                            <span className="ArchiveCard-detailItem">
                                {t('explorer.published')}:{' '}
                                {archive.publication_date}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="ArchiveCard-pageButton"
                        onClick={() =>
                            navigate(
                                `/${locale}/catalog/archives/${archive.id}`
                            )
                        }
                    >
                        {t('explorer.view_archive_page')}
                        <FaExternalLinkAlt className="ArchiveCard-pageLinkIcon" />
                    </button>

                    <CollectionList archive={archive} />
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
