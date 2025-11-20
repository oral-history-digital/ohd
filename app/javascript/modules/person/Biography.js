import classNames from 'classnames';
import { getArchiveId } from 'modules/archive';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { getCurrentInterview, getCurrentIntervieweeId } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { FaDownload } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import BiographicalEntriesContainer from './BiographicalEntriesContainer';
import { usePersonWithAssociations } from './hooks';

export default function Biography() {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const interview = useSelector(getCurrentInterview);
    const intervieweeId = useSelector(getCurrentIntervieweeId);
    const archiveId = useSelector(getArchiveId);
    const { data: interviewee, isLoading } =
        usePersonWithAssociations(intervieweeId);

    if (isLoading) {
        return <Spinner small />;
    }

    if (!interviewee.biographical_entries) {
        return null;
    }

    const firstPublicEntry = Object.values(
        interviewee.biographical_entries
    ).find((b) => b.workflow_state === 'public');
    const languagesOfPublicEntries = firstPublicEntry
        ? Object.keys(firstPublicEntry.text)
        : [];

    return (
        <div className={classNames('ContentField', 'LoadingOverlay')}>
            {firstPublicEntry && (
                <AuthShowContainer ifLoggedIn={true}>
                    <p>
                        <span className="flyout-content-label">
                            {t('history')}:
                        </span>
                        {languagesOfPublicEntries
                            .map((lang, index) => {
                                return (
                                    <a
                                        key={index}
                                        href={
                                            pathBase +
                                            '/biographical_entries/' +
                                            archiveId +
                                            '.pdf?lang=' +
                                            lang
                                        }
                                    >
                                        <FaDownload
                                            className="Icon Icon--small"
                                            title={t('download')}
                                        />{' '}
                                        {t(lang)}
                                    </a>
                                );
                            })
                            .reduce((prev, curr) => [prev, ' ', curr])}
                    </p>
                </AuthShowContainer>
            )}
            <AuthorizedContent
                object={{
                    type: 'BiographicalEntry',
                    interview_id: interview?.id,
                }}
                action="create"
            >
                <BiographicalEntriesContainer />
            </AuthorizedContent>
        </div>
    );
}
