import classNames from 'classnames';
import { pluralizeKey, useI18n } from 'modules/i18n';
import { LinkButton } from 'modules/ui';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt, FaMinus, FaPlus } from 'react-icons/fa';

import { useScrollToExpandedCard, useSelectableHeaderToggle } from '../hooks';
import { getProjectUrl } from '../utils';
import { CollectionList } from './CollectionList';
import { HighlightText } from './HighlightText';
import { InterviewLanguages, InterviewStats, RichtextDetail } from './details';

export function ArchiveCard({ archive, query, expanded, onToggle }) {
    const cardRef = useScrollToExpandedCard(expanded);
    const { t, locale } = useI18n();
    const institutionNames = archive.institutions
        ?.map((inst) => inst.name)
        .join(', ');
    const { handleHeaderClick, handleHeaderKeyDown } =
        useSelectableHeaderToggle(onToggle);

    // TODO: Sanitize projectUrl
    const { url: projectUrl, isExternalUrl: isExternalArchiveLink } =
        getProjectUrl(archive, locale);

    const countCollections = archive.collections?.total || 0;
    const countInterviews = archive.interviews?.total || 0;

    const formatNum = (num) => formatNumber(num, 0, locale);
    const numCollections = formatNum(countCollections);
    const numInterviews = formatNum(countInterviews);
    const collectionsLabel = t(
        pluralizeKey('activerecord.models.collection', countCollections, locale)
    );
    const interviewsLabel = t(
        pluralizeKey('activerecord.models.interview', countInterviews, locale)
    );

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
                        {countCollections > 0 && (
                            <span className="ArchiveCard-metaItem">
                                {numCollections} {collectionsLabel}
                            </span>
                        )}
                        {countInterviews > 0 && (
                            <span className="ArchiveCard-metaItem">
                                {numInterviews} {interviewsLabel}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="ArchiveCard-body">
                    <RichtextDetail
                        richtext={archive.introduction}
                        highlightString={query}
                    />
                    <InterviewStats counts={archive.interviews} />
                    <InterviewLanguages
                        languages={archive.languages_interviews}
                    />

                    <div className="ArchiveCard-pageButton">
                        <LinkButton
                            buttonText={t('explorer.view_archive_details')}
                            variant="outlined"
                            to={`/${locale}/catalog/archives/${archive.id}`}
                        />
                        <LinkButton
                            buttonText={t('explorer.view_archive_page')}
                            variant="contained"
                            to={projectUrl}
                            isExternal={isExternalArchiveLink}
                            target={
                                isExternalArchiveLink ? '_blank' : undefined
                            }
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
