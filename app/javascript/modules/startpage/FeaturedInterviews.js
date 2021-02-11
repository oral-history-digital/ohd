import React from 'react';
import { useSelector } from 'react-redux';

import { Fetch, getFeaturedInterviewsFetched, getFeaturedInterviewsArray } from 'modules/data';
import { InterviewPreviewContainer } from 'modules/interview-preview';

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
