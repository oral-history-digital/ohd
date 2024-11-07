import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

import { WorkbookItemForm } from 'modules/workbook';
import { Modal } from 'modules/ui';
import { InterviewInfoContainer, InterviewContributorsContainer } from 'modules/interview-metadata';
import { SelectedRegistryReferencesContainer } from 'modules/registry-references';
import { ContentField } from 'modules/forms';
import { Spinner } from 'modules/spinners';
import { PersonDataContainer, usePersonWithAssociations } from 'modules/person';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { useSearchSuggestions } from 'modules/search';
import { getNextInterview, getPreviousInterview } from '../getInterviews';

export default function InterviewDetailsLeftSide({
    archiveId,
    interview,
    intervieweeId,
    projectId,
}) {
    const pathBase = usePathBase();
    const { t } = useI18n();
    const { sortedArchiveIds } = useSearchSuggestions();
    const { data: interviewee, isLoading: intervieweeIsLoading } =
        usePersonWithAssociations(intervieweeId);

    let nextArchiveId, prevArchiveId;
    if (sortedArchiveIds) {
        nextArchiveId = getNextInterview(sortedArchiveIds, archiveId);
        prevArchiveId = getPreviousInterview(sortedArchiveIds, archiveId);
    }

    return (
        <div className="wrapper-content interviews flyout-folder">
            <div className="u-align-right">
                <Modal
                    title={t('save_interview_reference_tooltip')}
                    trigger={(<>
                        <FaStar className="Icon Icon--text" /> <span>{t('save_interview_reference')}</span>
                    </>)}
                    triggerClassName="Button Button--transparent"
                >
                    {closeModal => (
                        <WorkbookItemForm
                            interview={interview}
                            description=""
                            properties={{title: interview.title}}
                            reference_id={interview.id}
                            reference_type='Interview'
                            media_id={interview.archive_id}
                            type='InterviewReference'
                            submitLabel={t('modules.workbook.bookmark')}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </div>

            <h3>{t('person_info')}</h3>
            <div>
                <PersonDataContainer />
                {intervieweeIsLoading ?
                    <Spinner /> :
                    <SelectedRegistryReferencesContainer refObject={interviewee} />
                }
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
    );
}

InterviewDetailsLeftSide.propTypes = {
    interview: PropTypes.object.isRequired,
    intervieweeId: PropTypes.number,
    archiveId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
};
