import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { useTrackPageView } from 'modules/analytics';
import useLoadInterviewData from '../useLoadInterviewData';
import { EditTableLoader } from 'modules/edit-table';
import { MediaPlayer } from 'modules/media-player';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import MediaPreview from './MediaPreview';

export default function Interview({
    interview,
    interviewIsFetched,
    interviewEditView,
    isCatalog,
    setArchiveId,
}) {
    const { archiveId } = useParams();
    const { t, locale } = useI18n();

    useTrackPageView();

    useEffect(() => {
        setArchiveId(archiveId);
    }, []);

    useLoadInterviewData({
        interview,
        archiveId,
    });

    // Do not render InterviewTabs component as long as interview.lang is absent.
    // (Strangely, it sometimes becomes present only shortly after this component is rendered.)
    if (!interviewIsFetched || typeof interview?.lang !== 'string') {
        return <Spinner withPadding />;
    }

    const documentTitle = `${t('activerecord.models.interview.one')} ${interview?.archive_id}`;

    if (isCatalog) {
        if (interview?.contributions && Object.keys(interview.contributions).length > 0) {
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
                <AuthShowContainer ifLoggedIn>
                    <AuthorizedContent
                        object={interview}
                        action='show'
                        unauthorizedContent={<MediaPreview />}
                        showIfPublic
                    >
                        <MediaPlayer />
                        {
                            interviewEditView ?
                                <EditTableLoader /> :
                                <InterviewTabsContainer />

                        }
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
    isCatalog: PropTypes.bool.isRequired,
    interviewEditView: PropTypes.bool.isRequired,
    setArchiveId: PropTypes.func.isRequired,
};
