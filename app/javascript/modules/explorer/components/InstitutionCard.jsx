import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { HighlightText } from './HighlightText';

export function InstitutionCard({ institution, query, expanded, onToggle }) {
    const { t } = useI18n();
    const hasArchives = institution.archives?.length > 0;
    const hasChildren = institution.children?.length > 0;

    return (
        <div
            className={classNames('InstitutionCard', {
                'InstitutionCard--expanded': expanded,
            })}
        >
            <button
                className="InstitutionCard-header"
                onClick={onToggle}
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
            </button>

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
                            {institution.parent.name}
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
                                        <HighlightText
                                            text={child.name}
                                            query={query}
                                        />
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
                                        <div>
                                            <strong>
                                                <HighlightText
                                                    text={archive.name}
                                                    query={query}
                                                />
                                            </strong>
                                            {archive.interviews_count > 0 && (
                                                <span className="InstitutionCard-archiveCount">
                                                    {' '}
                                                    ({
                                                        archive.interviews_count
                                                    }{' '}
                                                    {t('explorer.interviews')})
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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
