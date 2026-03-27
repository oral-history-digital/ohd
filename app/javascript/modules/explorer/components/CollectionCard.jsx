import { useState } from 'react';

import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui';
import { formatNumber, isEmptyHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useMatch, useNavigate } from 'react-router-dom';

import { getProjectUrl } from '../utils';
import { HighlightText } from './HighlightText';
import { InterviewLanguages, InterviewStats, RichtextDetail } from './details';

export function CollectionCard({ collection, archive, query }) {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const match = useMatch('/:locale/*');
    const locale = match?.params?.locale || 'de';

    const { url: projectUrl } = getProjectUrl(archive, locale);

    const countInterviews = collection.interviews?.total || 0;
    const numInterviews = formatNumber(countInterviews, 0, locale);

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
                        <RichtextDetail
                            richtext={collection.notes}
                            highlightString={query}
                        />
                    ) : (
                        <p className="CollectionCard-notes CollectionCard-notes--empty">
                            {t('explorer.no_collection_notes')}
                        </p>
                    )}

                    <InterviewStats counts={collection.interviews} />

                    <InterviewLanguages
                        languages={collection.languages_interviews}
                    />

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
                                    `${projectUrl}/searches/archive?collection_id[]=${collection.id}`
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
