import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import InterviewEditViewContainer from '../containers/InterviewEditViewContainer';
import InterviewDetailsLeftSideContainer from '../containers/InterviewDetailsLeftSideContainer';
import VideoPlayerContainer from '../containers/VideoPlayerContainer';
import InterviewTabsContainer from '../containers/InterviewTabsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import InterviewLoggedOutContainer from '../containers/InterviewLoggedOutContainer';
import { INDEX_INTERVIEW } from '../constants/flyoutTabs';
import Fetch from './Fetch';
import Spinner from './Spinner';
import { getCurrentInterviewFetched } from '../selectors/dataSelectors';

export default function Interview({
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
            {
                isCatalog ?
                    <InterviewDetailsLeftSideContainer /> :
                    (
                        <div>
                            <AuthShowContainer ifLoggedIn>
                                <VideoPlayerContainer />
                                {
                                    interviewEditView ?
                                        <InterviewEditViewContainer /> :
                                        <InterviewTabsContainer />

                                }
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
    isCatalog: PropTypes.bool.isRequired,
    interviewEditView: PropTypes.bool.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
    setArchiveId: PropTypes.func.isRequired,
};
