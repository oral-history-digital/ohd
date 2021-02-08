import React from 'react';
import PropTypes from 'prop-types';

import InterviewSearchFormContainer from './InterviewSearchFormContainer';
import InterviewSearchResultsContainer from './InterviewSearchResultsContainer';

export default function InterviewSearch({
    interviews,
    archiveId,
    interviewSearchResults,
}) {
    return (
        <div>
            <InterviewSearchFormContainer />
            <InterviewSearchResultsContainer
                interview={interviews[archiveId]}
                searchResults={interviewSearchResults[archiveId]}
            />
        </div>
    );
}

InterviewSearch.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interviews: PropTypes.object.isRequired,
    interviewSearchResults: PropTypes.object.isRequired,
};
