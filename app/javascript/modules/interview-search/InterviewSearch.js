import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ScrollToTop } from 'modules/user-agent';
import { HelpText } from 'modules/help-text';
import InterviewSearchForm from './InterviewSearchForm';
import InterviewSearchResultsContainer from './InterviewSearchResultsContainer';

export default function InterviewSearch({
    locale,
    editView,
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
            {editView && <HelpText code="interview_search" className="u-mb" />}
            <InterviewSearchForm archiveId={archiveId} />
            <InterviewSearchResultsContainer archiveId={archiveId} />
        </ScrollToTop>
    );
}

InterviewSearch.propTypes = {
    locale: PropTypes.string.isRequired,
    editView: PropTypes.bool.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
