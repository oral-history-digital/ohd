import { useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui';
import { isEmptyHtml } from 'modules/utils';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useMatch, useNavigate } from 'react-router-dom';

import { getArchiveUrl, highlightQueryInHtml } from '../utils';
import { HighlightText } from './HighlightText';

export function CollectionCard({ collection, archive, query }) {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const match = useMatch('/:locale/*');
    const locale = match?.params?.locale || 'de';

    const archiveUrl = getArchiveUrl(archive, locale);

    const countInterviews = collection.interviews?.total || 0;
    const countAccessibleInterviews =
        collection.interviews?.public + collection.interviews?.restricted || 0;

    const formatNum = (num) => formatNumber(num, 0, locale);
    const numInterviews = formatNum(countInterviews);
    const numAccessibleInterviews = formatNum(countAccessibleInterviews);

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
                            {numInterviews} {t('explorer.interviews')}
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
                    {!isEmptyHtml(collection.notes) ? (
                        <div
                            className="CollectionCard-notes"
                            dangerouslySetInnerHTML={{
                                __html: highlightQueryInHtml(
                                    collection.notes,
                                    query
                                ),
                            }}
                        />
                    ) : (
                        <p className="CollectionCard-notes CollectionCard-notes--empty">
                            {t('explorer.no_collection_notes')}
                        </p>
                    )}

                    {countInterviews > 0 && (
                        <>
                            <div className="CollectionCard-interviewCounts CollectionCard-interviewCounts--total">
                                <span className="CollectionCard-label">
                                    {t('explorer.interviews_total')}:{' '}
                                </span>
                                <span className="CollectionCard-interviewCount">
                                    {numInterviews}
                                </span>
                            </div>
                            <div className="CollectionCard-interviewCounts CollectionCard-interviewCounts--accessible">
                                <span className="CollectionCard-label">
                                    {t('explorer.interviews_accessible')}:{' '}
                                </span>
                                <span className="CollectionCard-interviewCount">
                                    {numAccessibleInterviews}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="CollectionCard-pageButton">
                        <Button
                            buttonText={t('explorer.view_collection_details')}
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    `/${locale}/catalog/collections/${collection.id}`
                                )
                            }
                            size="sm"
                        />
                        <Button
                            buttonText={t('explorer.view_collection_page')}
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    `${archiveUrl}/searches/archive?collection_id[]=${collection.id}`
                                )
                            }
                            endIcon={<FaExternalLinkAlt />}
                            size="sm"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CollectionCard;

CollectionCard.propTypes = {
    collection: PropTypes.object.isRequired,
    archive: PropTypes.object.isRequired,
    query: PropTypes.string,
};
