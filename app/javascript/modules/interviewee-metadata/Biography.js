import { useSelector } from 'react-redux';
import { FaDownload } from 'react-icons/fa';

import { getCurrentInterview, getCurrentInterviewee } from 'modules/data';
import { getArchiveId } from 'modules/archive';
import { AuthorizedContent, AuthShowContainer } from 'modules/auth';
import BiographicalEntriesContainer from './BiographicalEntriesContainer';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

export default function Biography() { 

    const { t } = useI18n();
    const pathBase = usePathBase();

    const interviewee = useSelector(getCurrentInterviewee);
    const interview = useSelector(getCurrentInterview);
    const archiveId = useSelector(getArchiveId);

    const firstPublicEntry = Object.values(interviewee.biographical_entries).find(b => b.workflow_state === 'public');
    const languagesOfPublicEntries = firstPublicEntry ? Object.keys(firstPublicEntry.text) : [];

    return (
        <div>
            <AuthShowContainer ifLoggedIn={true}>
                <p>
                    <span className="flyout-content-label">
                        {t('history')}:
                    </span>
                    { firstPublicEntry ? languagesOfPublicEntries.map(lang => {
                        return (
                            <a href={pathBase + '/biographical_entries/' + archiveId + '.pdf?lang=' + lang}>
                                <FaDownload className="Icon Icon--small" title={t('download')} />
                                {' '}
                                {t(lang)}
                            </a>
                        )
                    }).reduce((prev, curr) => [prev, ' ', curr]) : '---' }
                </p>
            </AuthShowContainer>
            <AuthorizedContent object={{type: 'BiographicalEntry', interview_id: interview?.id}} action='create'>
                <BiographicalEntriesContainer />
            </AuthorizedContent>
        </div>
    );
}

