import PropTypes from 'prop-types';

import { ScrollToTop } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import InterviewSearchFormContainer from './InterviewSearchFormContainer';
import InterviewSearchResults from './InterviewSearchResults';

export default function InterviewSearch({
    interviews,
    archiveId,
    interviewSearchResults,
    isInterviewSearching = false,
}) {
    return (
        <ScrollToTop>
            <InterviewSearchFormContainer />
            {isInterviewSearching ?
                <Spinner /> : (
                <InterviewSearchResults
                    interview={interviews[archiveId]}
                    searchResults={interviewSearchResults[archiveId]}
                />
            )}
        </ScrollToTop>
    );
}

InterviewSearch.propTypes = {
    archiveId: PropTypes.string.isRequired,
    interviews: PropTypes.object.isRequired,
    interviewSearchResults: PropTypes.object.isRequired,
    isInterviewSearching: PropTypes.bool,
};
