import classNames from 'classnames';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { CollectionList } from './CollectionList';
import { HighlightText } from './HighlightText';

export function ArchiveCard({ archive, query, expanded, onToggle }) {
    const institutionNames = archive.institutions
        ?.map((inst) => inst.name)
        .join(', ');

    return (
        <div
            className={classNames('ArchiveCard', {
                'ArchiveCard--expanded': expanded,
            })}
        >
            <button
                className="ArchiveCard-header"
                onClick={onToggle}
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
                            {archive.collections?.total || 0} Collections
                        </span>
                        <span className="ArchiveCard-metaItem">
                            {archive.interviews?.total || 0} Interviews
                        </span>
                        {archive.publication_date && (
                            <span className="ArchiveCard-metaItem">
                                {archive.publication_date}
                            </span>
                        )}
                    </div>
                </div>
            </button>

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

                    {archive.more_text && (
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
                                Languages:{' '}
                                {archive.available_locales
                                    .map((l) => l.toUpperCase())
                                    .join(', ')}
                            </span>
                        )}
                        {archive.publication_date && (
                            <span className="ArchiveCard-detailItem">
                                Published: {archive.publication_date}
                            </span>
                        )}
                    </div>

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
