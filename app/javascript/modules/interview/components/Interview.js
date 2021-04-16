import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { InterviewEditViewContainer } from 'modules/interview-edit';
import { MediaPlayerContainer } from 'modules/media-player';
import { AuthShowContainer } from 'modules/auth';
import { AuthorizedContent } from 'modules/auth';
import { INDEX_INTERVIEW } from 'modules/flyout-tabs';
import { Spinner } from 'modules/spinners';
import { Fetch, getContributorsFetched, getCurrentInterviewFetched } from 'modules/data';
import InterviewDetailsLeftSideContainer from './InterviewDetailsLeftSideContainer';
import InterviewTabsContainer from './InterviewTabsContainer';
import InterviewLoggedOutContainer from './InterviewLoggedOutContainer';

export default function Interview({
    interview,
    interviewEditView,
    isCatalog,
    setFlyoutTabsIndex,
    setArchiveId,
}) {
    const { archiveId } = useParams();

    useEffect(() => {
        setFlyoutTabsIndex(INDEX_INTERVIEW);
        setArchiveId(archiveId);
    }, []);

    return (
        <Fetch
            fetchParams={['interviews', archiveId]}
            testSelector={getCurrentInterviewFetched}
            fallback={<Spinner withPadding />}
        >
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
                                    <AuthorizedContent  object={interview} showUnauthorizedMsg>
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
        </Fetch>
    );
}

Interview.propTypes = {
    interview: PropTypes.object,
    isCatalog: PropTypes.bool.isRequired,
    interviewEditView: PropTypes.bool.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
    setArchiveId: PropTypes.func.isRequired,
};
