import React from 'react';
import { useSelector } from 'react-redux';

import { getFeaturedInterviewsFetched, getFeaturedInterviewsArray } from '../selectors/dataSelectors';
import InterviewPreviewContainer from '../containers/InterviewPreviewContainer';
import Fetch from './Fetch';

export default function FeaturedInterviews() {
    const interviews = useSelector(getFeaturedInterviewsArray);

    return (
        <Fetch
            fetchParams={['random_featured_interviews']}
            testSelector={getFeaturedInterviewsFetched}
        >
            {
                interviews.map(interview => (
                    <InterviewPreviewContainer
                        key={interview.id}
                        interview={interview}
                    />
                ))
            }
        </Fetch>
    );
}
