import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useIsEditor } from 'modules/archive';
import { ScrollToTop } from 'modules/user-agent';
import { HelpText } from 'modules/help-text';
import InterviewSearchForm from './InterviewSearchForm';
import InterviewSearchResultsContainer from './InterviewSearchResultsContainer';

export default function InterviewSearch({
    locale,
    projectId,
    project,
    archiveId,
    refTreeStatus,
    fetchData,
}) {
    const isEditor = useIsEditor();

    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData({ locale, projectId, project }, 'interviews', archiveId, 'ref_tree');
        }
    });

    return (
        <ScrollToTop>
            {isEditor && <HelpText code="interview_search" className="u-mb" />}
            <InterviewSearchForm archiveId={archiveId} />
            <InterviewSearchResultsContainer archiveId={archiveId} />
        </ScrollToTop>
    );
}

InterviewSearch.propTypes = {
    locale: PropTypes.string.isRequired,
    editView: PropTypes.bool.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
