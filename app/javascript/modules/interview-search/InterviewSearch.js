import { useEffect } from 'react';

import { useIsEditor } from 'modules/archive';
import { HelpText } from 'modules/help-text';
import { usePathBase } from 'modules/routes';
import { ScrollToTop } from 'modules/user-agent';
import PropTypes from 'prop-types';

import InterviewSearchForm from './InterviewSearchForm';
import InterviewSearchResultsContainer from './InterviewSearchResultsContainer';

/**
 * Shows interview search and loads reference data used by its results.
 *
 * @param {Object} props - Search context.
 * @param {string} props.archiveId - Public interview identifier.
 * @param {string} props.refTreeStatus - Reference-tree request status.
 * @param {Function} props.fetchData - Loads interview resources through Redux.
 * @returns {React.ReactElement} Search form, results, and editor help.
 */
export default function InterviewSearch({
    archiveId,
    refTreeStatus,
    fetchData,
}) {
    const pathBase = usePathBase();
    const isEditor = useIsEditor();

    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData({ pathBase }, 'interviews', archiveId, 'ref_tree');
        }
    }, [refTreeStatus, fetchData, pathBase, archiveId]);

    return (
        <ScrollToTop>
            {isEditor && <HelpText code="interview_search" className="u-mb" />}
            <InterviewSearchForm archiveId={archiveId} />
            <InterviewSearchResultsContainer archiveId={archiveId} />
        </ScrollToTop>
    );
}

InterviewSearch.propTypes = {
    archiveId: PropTypes.string.isRequired,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
