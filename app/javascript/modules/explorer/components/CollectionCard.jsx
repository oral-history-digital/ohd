import { useState } from 'react';

import classNames from 'classnames';
import { pluralizeKey, useI18n } from 'modules/i18n';
import { LinkButton } from 'modules/ui';
import { formatNumber, isEmptyHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useMatch } from 'react-router-dom';

import { getProjectUrl } from '../utils';
import { HighlightText } from './HighlightText';
import { InterviewLanguages, InterviewStats, RichtextDetail } from './details';

export function CollectionCard({ collection, archive, query }) {
    const { t } = useI18n();
    const [expanded, setExpanded] = useState(false);
    const match = useMatch('/:locale/*');
    const locale = match?.params?.locale || 'de';

    const { url, isExternalUrl } = getProjectUrl(archive, locale);
    const projectUrl = isExternalUrl ? `${url}/${locale}` : url; // Ensure we have the locale in the URL for external links

    const collectionDetailsUrl = `/${locale}/catalog/collections/${collection.id}`;
    const collectionPageUrl = `${projectUrl}/searches/archive?collection_id[]=${collection.id}`;

    const countInterviews = collection.interviews?.total || 0;
    const numInterviews = formatNumber(countInterviews, 0, locale);

    const interviewsLabel = t(
        pluralizeKey('activerecord.models.interview', countInterviews, locale)
    );

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
                            {numInterviews} {interviewsLabel}
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
                        <LinkButton
                            buttonText={t('explorer.view_collection_details')}
                            variant="outlined"
                            to={collectionDetailsUrl}
                            size="sm"
                        />
                        <LinkButton
                            buttonText={t('explorer.view_collection_page')}
                            variant="contained"
                            to={collectionPageUrl}
                            size="sm"
                            isExternal={isExternalUrl}
                            target={isExternalUrl ? '_blank' : undefined}
                            endIcon={<FaExternalLinkAlt />}
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
