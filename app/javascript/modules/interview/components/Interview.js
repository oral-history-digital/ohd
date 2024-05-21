import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { useTrackPageView } from 'modules/analytics';
import { EditTableLoader } from 'modules/edit-table';
import { MediaPlayer } from 'modules/media-player';
import { AuthShowContainer, AuthorizedContent,
    useProjectAccessStatus, useAuthorization } from 'modules/auth';
import { getEditView } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { getInterviewsStatus } from 'modules/data';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import MediaPreview from './MediaPreview';

export default function Interview({
    interview,
    interviewIsFetched,
    interviewEditView,
    isCatalog,
    setArchiveId,
    fetchData,
    isLoggedIn,
}) {
    const { archiveId } = useParams();
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const { isAuthorized } = useAuthorization();
    const statuses = useSelector(getInterviewsStatus);
    const editView = useSelector(getEditView);
    const status = statuses[archiveId];

    useTrackPageView();

    useEffect(() => {
        setArchiveId(archiveId);
    }, []);

    // fetch interview base data
    useEffect(() => {
        if (!status) {
            fetchData({ projectId, locale, project }, 'interviews', archiveId);
        }
    }, [projectId, locale, archiveId, status]);

    // fetch non-public data if project-access granted
    useEffect(() => {
        if (projectAccessGranted) {
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'title');
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'short_title');
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'description');
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'photos');
        }
        if (isAuthorized(interview, 'update')) {
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'reload_translations');
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'observations');
        }
    }, [archiveId, isLoggedIn, editView]);

    // Do not render InterviewTabs component as long as interview.lang is absent.
    // (Strangely, it sometimes becomes present only shortly after this component is rendered.)
    if (!interviewIsFetched || typeof interview?.lang !== 'string') {
        return <Spinner withPadding />;
    }

    const documentTitle = `${t('activerecord.models.interview.one')} ${interview?.archive_id}`;

    if (isCatalog) {
        return <InterviewDetailsLeftSideContainer />;
    } else {
        return (
            <div>
                <Helmet>
                    <title>{documentTitle}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn>
                    <AuthorizedContent  object={interview} action='show' showUnauthorizedMsg showIfPublic>
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
    fetchData: PropTypes.func.isRequired,
};
