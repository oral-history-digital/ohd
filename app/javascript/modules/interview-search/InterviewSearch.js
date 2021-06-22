import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ScrollToTop } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import InterviewSearchFormContainer from './InterviewSearchFormContainer';
import InterviewSearchResults from './InterviewSearchResults';

export default function InterviewSearch({
    locale,
    projectId,
    projects,
    archiveId,
    isInterviewSearching = false,
    refTreeStatus,
    fetchData,
}) {
    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData({ locale, projectId, projects }, 'interviews', archiveId, 'ref_tree');
        }
    });

    return (
        <ScrollToTop>
            <InterviewSearchFormContainer />
            {isInterviewSearching ?
                <Spinner /> : (
                <InterviewSearchResults />
            )}
        </ScrollToTop>
    );
}

InterviewSearch.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    isInterviewSearching: PropTypes.bool,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
