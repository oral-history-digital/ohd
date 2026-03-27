import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui';
import { formatNumber } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useScrollToExpandedCard, useSelectableHeaderToggle } from '../hooks';
import { HighlightText } from './HighlightText';
import { Institutions, InterviewStats, RichtextDetail } from './details';

export function InstitutionCard({ institution, query, expanded, onToggle }) {
    const cardRef = useScrollToExpandedCard(expanded);
    const { t, locale } = useI18n();
    const navigate = useNavigate();
    const hasChildren = institution.children?.length > 0;
    const { handleHeaderClick, handleHeaderKeyDown } =
        useSelectableHeaderToggle(onToggle);

    const countArchives = institution.archives?.length || 0;
    const countCollections =
        (institution.collections?.public || 0) +
        (institution.collections?.restricted || 0);
    const countInterviews = institution.interviews?.total || 0;

    const formatNum = (num) => formatNumber(num, 0, locale);
    const numArchives = formatNum(countArchives);
    const numCollections = formatNum(countCollections);
    const numInterviews = formatNum(countInterviews);

    return (
        <div
            ref={cardRef}
            className={classNames('InstitutionCard', {
                'InstitutionCard--expanded': expanded,
            })}
        >
            <div
                className="InstitutionCard-header"
                onClick={handleHeaderClick}
                onKeyDown={handleHeaderKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
            >
                <span className="InstitutionCard-chevron">
                    {expanded ? <FaMinus /> : <FaPlus />}
                </span>

                <div className="InstitutionCard-headerContent">
                    <h3 className="InstitutionCard-title">
                        <HighlightText text={institution.name} query={query} />
                    </h3>
                    <div className="InstitutionCard-meta">
                        {institution.parent?.name && (
                            <span className="InstitutionCard-metaItem">
                                {institution.parent.name}
                            </span>
                        )}
                        {hasChildren && (
                            <span className="InstitutionCard-metaItem">
                                {institution.children.length}{' '}
                                {t('explorer.sub_institutions')}
                            </span>
                        )}
                        {countArchives > 0 && (
                            <span className="InstitutionCard-metaItem">
                                {numArchives} {t('explorer.archives')}
                            </span>
                        )}
                        {countCollections > 0 && (
                            <span className="InstitutionCard-metaItem">
                                {numCollections} {t('explorer.collections')}
                            </span>
                        )}
                        {countInterviews > 0 && (
                            <span className="InstitutionCard-metaItem">
                                {numInterviews} {t('explorer.interviews')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="InstitutionCard-body">
                    <RichtextDetail
                        richtext={institution.description}
                        highlightString={query}
                    />

                    <Institutions
                        institutions={institution.parent}
                        labelKey="explorer.parent_institution"
                    />

                    <Institutions
                        institutions={institution.children}
                        labelKey="explorer.sub_institutions"
                    />

                    <InterviewStats counts={institution.interviews} />

                    <div className="InstitutionCard-pageButton">
                        <Button
                            buttonText={t('explorer.view_institution_details')}
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    `/${locale}/catalog/institutions/${institution.id}`
                                )
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default InstitutionCard;

InstitutionCard.propTypes = {
    institution: PropTypes.object.isRequired,
    query: PropTypes.string,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
};
