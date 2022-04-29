import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ScrollToTop } from 'modules/user-agent';
import InterviewSearchForm from './InterviewSearchForm';
import InterviewSearchResultsContainer from './InterviewSearchResultsContainer';

export default function InterviewSearch({
    locale,
    projectId,
    projects,
    archiveId,
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
            <InterviewSearchForm archiveId={archiveId} />
            <InterviewSearchResultsContainer archiveId={archiveId} />
        </ScrollToTop>
    );
}

InterviewSearch.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
