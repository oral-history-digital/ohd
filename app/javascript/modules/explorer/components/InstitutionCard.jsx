import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { Button } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import { useScrollToExpandedCard, useSelectableHeaderToggle } from '../hooks';
import { HighlightText } from './HighlightText';

export function InstitutionCard({ institution, query, expanded, onToggle }) {
    const cardRef = useScrollToExpandedCard(expanded);
    const { t, locale } = useI18n();
    const navigate = useNavigate();
    const hasArchives = institution.archives?.length > 0;
    const hasChildren = institution.children?.length > 0;
    const { handleHeaderClick, handleHeaderKeyDown } =
        useSelectableHeaderToggle(onToggle);
    const institutionDetailsPath = (id) =>
        `/${locale}/catalog/institutions/${id}`;
    const archiveDetailsPath = (id) => `/${locale}/catalog/archives/${id}`;

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
                        {hasArchives && (
                            <span className="InstitutionCard-metaItem">
                                {institution.archives.length}{' '}
                                {t('explorer.archives')}
                            </span>
                        )}
                        <span className="InstitutionCard-metaItem">
                            {institution.interviews?.total || 0}{' '}
                            {t('explorer.interviews')}
                        </span>
                        {hasChildren && (
                            <span className="InstitutionCard-metaItem">
                                {institution.children.length}{' '}
                                {t('explorer.sub_institutions')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="InstitutionCard-body">
                    {institution.description && (
                        <p className="InstitutionCard-description">
                            <HighlightText
                                text={institution.description}
                                query={query}
                            />
                        </p>
                    )}

                    {institution.parent?.name && (
                        <div className="InstitutionCard-parent">
                            <span className="InstitutionCard-label">
                                {t('explorer.parent_institution')}:{' '}
                            </span>
                            {institution.parent.id ? (
                                <Link
                                    to={institutionDetailsPath(
                                        institution.parent.id
                                    )}
                                    className="InstitutionCard-inlineLink"
                                >
                                    {institution.parent.name}
                                </Link>
                            ) : (
                                institution.parent.name
                            )}
                        </div>
                    )}

                    {hasChildren && (
                        <div className="InstitutionCard-children">
                            <h4 className="InstitutionCard-sectionTitle">
                                {t('explorer.sub_institutions')}
                            </h4>
                            <ul className="InstitutionCard-list">
                                {institution.children.map((child) => (
                                    <li key={child.id}>
                                        <Link
                                            to={institutionDetailsPath(
                                                child.id
                                            )}
                                            className="InstitutionCard-listLink"
                                        >
                                            <HighlightText
                                                text={child.name}
                                                query={query}
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {hasArchives && (
                        <div className="InstitutionCard-archives">
                            <h4 className="InstitutionCard-sectionTitle">
                                {t('explorer.archives')}
                            </h4>
                            <ul className="InstitutionCard-list">
                                {institution.archives.map((archive) => (
                                    <li
                                        key={archive.id}
                                        className="InstitutionCard-archiveItem"
                                    >
                                        <Link
                                            to={archiveDetailsPath(archive.id)}
                                            className="InstitutionCard-listLink"
                                        >
                                            <HighlightText
                                                text={archive.name}
                                                query={query}
                                            />
                                            {archive.interviews_count > 0 && (
                                                <span className="InstitutionCard-archiveCount">
                                                    {' '}
                                                    ({
                                                        archive.interviews_count
                                                    }{' '}
                                                    {t('explorer.interviews')})
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="InstitutionCard-pageButton">
                        <Button
                            buttonText={t('explorer.view_institution_details')}
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    `/${locale}/catalog/institutions/${institution.id}`
                                )
                            }
                            endIcon={<FaExternalLinkAlt />}
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
