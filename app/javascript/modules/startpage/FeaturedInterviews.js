import React from 'react';
import { useSelector } from 'react-redux';

import { getFeaturedInterviewsFetched, getFeaturedInterviewsArray } from 'bundles/archive/selectors/dataSelectors';
import InterviewPreviewContainer from 'bundles/archive/containers/InterviewPreviewContainer';
import Fetch from 'bundles/archive/components/Fetch';

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
