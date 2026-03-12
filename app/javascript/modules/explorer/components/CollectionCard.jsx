import { useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { HighlightText } from './HighlightText';

export function CollectionCard({ collection, query }) {
    const { t } = useI18n();
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={classNames('CollectionCard', {
                'CollectionCard--expanded': expanded,
            })}
        >
            <button
                className="CollectionCard-header"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
            >
                <span className="CollectionCard-chevron">
                    {expanded ? <FaMinus /> : <FaPlus />}
                </span>
                <div className="CollectionCard-headerContent">
                    <h4 className="CollectionCard-title">
                        <HighlightText text={collection.name} query={query} />
                    </h4>
                    <div className="CollectionCard-meta">
                        <span className="CollectionCard-metaItem">
                            {collection.interviews?.total || 0}{' '}
                            {t('explorer.interviews')}
                        </span>
                        {collection.institution && (
                            <span className="CollectionCard-metaItem">
                                <HighlightText
                                    text={collection.institution.name}
                                    query={query}
                                />
                            </span>
                        )}
                    </div>
                </div>
            </button>

            {expanded && (
                <div className="CollectionCard-body">
                    {collection.notes && (
                        <div
                            className="CollectionCard-notes"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(collection.notes),
                            }}
                        />
                    )}

                    <div className="CollectionCard-details">
                        {collection.responsibles?.length > 0 && (
                            <span className="CollectionCard-detailItem">
                                {t('explorer.responsible')}:{' '}
                                {collection.responsibles.join(', ')}
                            </span>
                        )}
                        {collection.homepage && (
                            <a
                                className="CollectionCard-detailItem CollectionCard-link"
                                href={collection.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('explorer.homepage')}
                            </a>
                        )}
                        {collection.publication_date && (
                            <span className="CollectionCard-detailItem">
                                {t('explorer.published')}:{' '}
                                {collection.publication_date}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollectionCard;

CollectionCard.propTypes = {
    collection: PropTypes.object.isRequired,
    query: PropTypes.string,
};
