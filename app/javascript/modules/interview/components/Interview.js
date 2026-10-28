import { useEffect } from 'react';

import { useTrackPageView } from 'modules/analytics';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { EditTableLoader } from 'modules/edit-table';
import { useI18n } from 'modules/i18n';
import { MediaPlayer } from 'modules/media-player';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

import useLoadInterviewData from '../useLoadInterviewData';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import MediaPreview from './MediaPreview';

/**
 * Displays a catalog interview summary or the full interview workspace using project settings.
 * @param {Object} props - Interview record, fetch/edit status, and interview selection action.
 * @returns {React.ReactElement} Interview content, loading indicator, or project request error.
 */
export default function Interview({
    interview,
    interviewIsFetched,
    interviewEditView,
    setArchiveId,
}) {
    const { archiveId } = useParams();
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({});

    useTrackPageView();

    useEffect(() => {
        setArchiveId(archiveId);
    }, [archiveId, setArchiveId]);

    useLoadInterviewData({
        interview,
        archiveId,
    });

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );

    // Do not render InterviewTabs component as long as interview.alpha3 is absent.
    // (Strangely, it sometimes becomes present only shortly after this component is rendered.)
    if (
        isLoading ||
        !project ||
        !interviewIsFetched ||
        typeof interview?.alpha3 !== 'string'
    ) {
        return (
            <div style={{ textAlign: 'center' }}>
                <Spinner size={200} color="#f8f8f8" withPadding />
            </div>
        );
    }

    const documentTitle = `${t('activerecord.models.interview.one')} ${
        interview?.archive_id
    }`;

    if (project.is_catalog) {
        if (
            interview?.contributions &&
            Object.keys(interview.contributions).length > 0
        ) {
            return <InterviewDetailsLeftSideContainer />;
        } else {
            return <Spinner withPadding />;
        }
    } else {
        return (
            <div>
                <Helmet>
                    <title>{documentTitle}</title>
                </Helmet>
                <AuthShowContainer hasProjectAccess>
                    <AuthorizedContent
                        object={interview}
                        action="show"
                        unauthorizedContent={<MediaPreview />}
                        showIfPublic
                    >
                        <MediaPlayer />
                        {interviewEditView ? (
                            <EditTableLoader />
                        ) : (
                            <InterviewTabsContainer />
                        )}
                    </AuthorizedContent>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut ifNoProject>
                    <MediaPreview />
                </AuthShowContainer>
            </div>
        );
    }
}

Interview.propTypes = {
    interview: PropTypes.object,
    interviewIsFetched: PropTypes.bool.isRequired,
    interviewEditView: PropTypes.bool.isRequired,
    setArchiveId: PropTypes.func.isRequired,
};
