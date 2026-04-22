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

export function ProjectCard({ project, query, expanded, onToggle }) {
    const cardRef = useScrollToExpandedCard(expanded);
    const { t, locale } = useI18n();
    const institutionNames = project.institutions
        ?.map((inst) => inst.name)
        .join(' / ');
    const { handleHeaderClick, handleHeaderKeyDown } =
        useSelectableHeaderToggle(onToggle);

    // TODO: Sanitize projectUrl
    const { url: projectUrl, isExternalUrl: isExternalProjectLink } =
        getProjectUrl(project, locale);

    const countCollections = project.collections?.total || 0;
    const countInterviews = project.interviews?.total || 0;

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
            className={classNames('ProjectCard', {
                'ProjectCard--expanded': expanded,
            })}
        >
            <div
                className="ProjectCard-header"
                onClick={handleHeaderClick}
                onKeyDown={handleHeaderKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
            >
                <span className="ProjectCard-chevron">
                    {expanded ? <FaMinus /> : <FaPlus />}
                </span>

                <div className="ProjectCard-headerContent">
                    <h3 className="ProjectCard-title">
                        <HighlightText
                            text={project.display_name || project.name}
                            query={query}
                        />
                    </h3>
                    <div className="ProjectCard-meta">
                        {institutionNames && (
                            <span className="ProjectCard-metaItem">
                                <HighlightText
                                    text={institutionNames}
                                    query={query}
                                />
                            </span>
                        )}
                        {countCollections > 0 && (
                            <span className="ProjectCard-metaItem">
                                {numCollections} {collectionsLabel}
                            </span>
                        )}
                        {countInterviews > 0 && (
                            <span className="ProjectCard-metaItem">
                                {numInterviews} {interviewsLabel}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="ProjectCard-body">
                    <RichtextDetail
                        richtext={project.introduction}
                        highlightString={query}
                    />
                    <InterviewStats counts={project.interviews} />
                    <InterviewLanguages
                        languages={project.languages_interviews}
                    />

                    <div className="ProjectCard-pageButton">
                        <LinkButton
                            buttonText={t('explorer.view_project_details')}
                            variant="outlined"
                            to={`/${locale}/catalog/archives/${project.id}`}
                        />
                        <LinkButton
                            buttonText={t('explorer.view_project_page')}
                            variant="contained"
                            to={projectUrl}
                            isExternal={isExternalProjectLink}
                            target={
                                isExternalProjectLink ? '_blank' : undefined
                            }
                            endIcon={<FaExternalLinkAlt />}
                        />
                    </div>

                    {/* Don't pass query. we want all related collections */}
                    <CollectionList project={project} />
                </div>
            )}
        </div>
    );
}

export default ProjectCard;

ProjectCard.propTypes = {
    project: PropTypes.object.isRequired,
    query: PropTypes.string,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
};
