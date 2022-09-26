import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { InterviewInfoContainer, InterviewContributorsContainer } from 'modules/interview-metadata';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { ContentField } from 'modules/forms';
import { PersonDataContainer } from 'modules/interviewee-metadata';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { useSearchSuggestions } from 'modules/search';
import { getNextInterview, getPreviousInterview } from '../getInterviews';

export default function InterviewDetailsLeftSide({
    archiveId,
    interview,
    interviewee,
    projectId,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();
    const { sortedArchiveIds } = useSearchSuggestions();

    let nextArchiveId, prevArchiveId;
    if (sortedArchiveIds) {
        nextArchiveId = getNextInterview(sortedArchiveIds, archiveId);
        prevArchiveId = getPreviousInterview(sortedArchiveIds, archiveId);
    }

    return (
        <div className={classNames('flyout-folder')} >
            <div style={{ padding: "5%" }} >
                <h3>{t('person_info')}</h3>
                <div>
                    <PersonDataContainer />
                    {interviewee && (
                        <SelectedRegistryReferencesContainer refObject={interviewee} />
                    )}
                </div>
                <h3>{t('interview_info')}</h3>
                <InterviewInfoContainer />
                <InterviewContributorsContainer/>
                { interview?.properties?.subcollection &&
                    <ContentField
                        label={t('subcollection')}
                        value={interview.properties.subcollection}
                    />
                }
                {interview?.properties?.link && (
                    <ContentField
                        label="Link"
                        value={(
                            <a
                                href={interview.properties.link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {interview.properties.link}
                            </a>
                        )}
                    />)
                }
                {projectId === 'campscapes' && (
                    <div className="footer-navigation">
                        <Link
                            className={classNames('search-result-link', {
                                'hidden': !prevArchiveId,
                            })}
                            to={`${pathBase}/interviews/${prevArchiveId}`}
                        >
                            <FaChevronLeft className="Icon Icon--text" />
                            {prevArchiveId}
                        </Link>
                        {' '}
                        <Link
                            className={classNames('search-result-link', {
                                'hidden': !nextArchiveId,
                            })}
                            to={`${pathBase}/interviews/${nextArchiveId}`}
                        >
                            {nextArchiveId}
                            <FaChevronRight className="Icon Icon--text" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

InterviewDetailsLeftSide.propTypes = {
    interview: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    interviewee: PropTypes.object.isRequired,
};
