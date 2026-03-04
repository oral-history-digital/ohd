import { useState } from 'react';

import classNames from 'classnames';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { useGetCollections } from '../hooks';
import { CollectionCard } from './CollectionCard';
import { HighlightText } from './HighlightText';

export function ArchiveCard({ archive, query }) {
    const [expanded, setExpanded] = useState(false);
    const { collections } = useGetCollections(archive.id);

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
                onClick={() => setExpanded((prev) => !prev)}
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

                    {collections && collections.length > 0 && (
                        <div className="ArchiveCard-collections">
                            <h4 className="ArchiveCard-collectionsTitle">
                                Collections ({collections.length})
                            </h4>
                            {collections.map((collection) => (
                                <CollectionCard
                                    key={collection.id}
                                    collection={collection}
                                    query={query}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ArchiveCard;

ArchiveCard.propTypes = {
    archive: PropTypes.object.isRequired,
    query: PropTypes.string,
};
