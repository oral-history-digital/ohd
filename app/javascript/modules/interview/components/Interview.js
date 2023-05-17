import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { EditTableLoader } from 'modules/edit-table';
import { MediaPlayerContainer } from 'modules/media-player';
import { AuthShowContainer, AuthorizedContent, useProjectAccessStatus } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { getInterviewsStatus } from 'modules/data';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import InterviewLoggedOut from './InterviewLoggedOut';

export default function Interview({
    interview,
    interviewIsFetched,
    interviewEditView,
    isCatalog,
    projectId,
    project,
    setArchiveId,
    fetchData,
    isLoggedIn,
}) {
    const { archiveId } = useParams();
    const { t, locale } = useI18n();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const statuses = useSelector(getInterviewsStatus);
    const status = statuses[archiveId];

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
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'observations');
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'photos');
            fetchData({ projectId, locale, project }, 'interviews', archiveId, 'reload_translations');
        }
    }, [archiveId, isLoggedIn]);

    // Do not render InterviewTabs component as long as interview.lang is absent.
    // (Strangely, it sometimes becomes present only shortly after this component is rendered.)
    if (!interviewIsFetched || typeof interview?.lang !== 'string') {
        return <Spinner withPadding />;
    }

    if (isCatalog) {
        return <InterviewDetailsLeftSideContainer />;
    } else {
        return (
            <div>
                <Helmet>
                    <title>{t('activerecord.models.interview.one')} {interview.archive_id}</title>
                </Helmet>
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
                    <InterviewLoggedOut />
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
    project: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
