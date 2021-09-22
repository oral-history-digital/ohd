import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { EditTableLoader } from 'modules/edit-table';
import { MediaPlayerContainer } from 'modules/media-player';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { INDEX_INTERVIEW } from 'modules/flyout-tabs';
import { Spinner } from 'modules/spinners';
import { Fetch, getContributorsFetched, getInterviewsStatus } from 'modules/data';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import InterviewLoggedOutContainer from './InterviewLoggedOutContainer';
import { useProjectAccessStatus } from 'modules/auth';

export default function Interview({
    interview,
    interviewIsFetched,
    contributorsAreFetched,
    interviewEditView,
    isCatalog,
    projectId,
    projects,
    project,
    locale,
    setFlyoutTabsIndex,
    setArchiveId,
    fetchData,
    isLoggedIn,
}) {
    const { archiveId } = useParams();

    const { projectAccessGranted } = useProjectAccessStatus();
    const statuses = useSelector(getInterviewsStatus);
    const status = statuses[archiveId];

    useEffect(() => {
        setFlyoutTabsIndex(INDEX_INTERVIEW);
        setArchiveId(archiveId);
    }, []);

    // fetch interview base data
    useEffect(() => {
        if (!status) {
            fetchData({ projectId, locale, projects }, 'interviews', archiveId);
        }
    }, [projectId, locale, archiveId, status]);

    // fetch non-public data if project-access granted
    useEffect(() => {
        if (projectAccessGranted) {
            fetchData({ projectId, locale, projects }, 'interviews', archiveId, 'title');
            fetchData({ projectId, locale, projects }, 'interviews', archiveId, 'short_title');
            fetchData({ projectId, locale, projects }, 'interviews', archiveId, 'description');
            fetchData({ projectId, locale, projects }, 'interviews', archiveId, 'observations');
            fetchData({ projectId, locale, projects }, 'interviews', archiveId, 'photos');
        }
    }, [archiveId, isLoggedIn]);

    useEffect(() => {
        if (projectAccessGranted && !contributorsAreFetched && interview?.id) {
            fetchData({ projectId, locale, projects }, 'people', null, null, `contributors_for_interview=${interview.id}`);
        }
    }, [archiveId, isLoggedIn, contributorsAreFetched, interview?.id]);

    if (!interviewIsFetched) {
        return <Spinner withPadding />;
    }

    if (isCatalog) {
        return <InterviewDetailsLeftSideContainer />;
    } else {
        return (
            <div>
                <AuthShowContainer ifLoggedIn>
                    <AuthorizedContent  object={interview} action='show' showUnauthorizedMsg showIfPublic>
                        <MediaPlayerContainer />
                        {
                            interviewEditView ?
                                <EditTableLoader /> :
                                <InterviewTabsContainer />

                        }
                    </AuthorizedContent>
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut ifNoProject>
                    <InterviewLoggedOutContainer />
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
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
