import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { InterviewEditViewContainer } from 'modules/interview-edit';
import { MediaPlayerContainer } from 'modules/media-player';
import { AuthShowContainer } from 'modules/auth';
import { AuthorizedContent } from 'modules/auth';
import { INDEX_INTERVIEW } from 'modules/flyout-tabs';
import { Spinner } from 'modules/spinners';
import { Fetch, getContributorsFetched } from 'modules/data';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import InterviewLoggedOutContainer from './InterviewLoggedOutContainer';

export default function Interview({
    interview,
    interviewIsFetched,
    interviewEditView,
    isCatalog,
    projectId,
    projects,
    locale,
    setFlyoutTabsIndex,
    setArchiveId,
    fetchData,
}) {
    const { archiveId } = useParams();

    useEffect(() => {
        setFlyoutTabsIndex(INDEX_INTERVIEW);
        setArchiveId(archiveId);
    }, []);

    useEffect(() => {
        fetchData({ projectId, locale, projects }, 'interviews', archiveId);
    }, [projectId, locale, archiveId]);

    if (!interviewIsFetched) {
        return <Spinner withPadding />;
    }

    return (
        <Fetch
            fetchParams={['people', null, null, `contributors_for_interview=${interview?.id}`]}
            testSelector={getContributorsFetched}
            alwaysRenderChildren
        >
            {
                isCatalog ?
                    <InterviewDetailsLeftSideContainer /> :
                    (
                        <div>
                            <AuthShowContainer ifLoggedIn>
                                <AuthorizedContent  object={interview} action='show' showUnauthorizedMsg showIfPublic>
                                    <MediaPlayerContainer />
                                    {
                                        interviewEditView ?
                                            <InterviewEditViewContainer /> :
                                            <InterviewTabsContainer />

                                    }
                                </AuthorizedContent>
                            </AuthShowContainer>
                            <AuthShowContainer ifLoggedOut ifNoProject>
                                <InterviewLoggedOutContainer />
                            </AuthShowContainer>
                        </div>
                    )
            }
        </Fetch>
    );
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
