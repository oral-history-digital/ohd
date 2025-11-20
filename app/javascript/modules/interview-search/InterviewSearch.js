import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useIsEditor } from 'modules/archive';
import { ScrollToTop } from 'modules/user-agent';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import InterviewSearchForm from './InterviewSearchForm';
import InterviewSearchResultsContainer from './InterviewSearchResultsContainer';

export default function InterviewSearch({
    archiveId,
    refTreeStatus,
    fetchData,
}) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();
    const isEditor = useIsEditor();

    useEffect(() => {
        if (refTreeStatus === 'n/a') {
            fetchData(
                { locale, projectId, project },
                'interviews',
                archiveId,
                'ref_tree'
            );
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
    archiveId: PropTypes.string.isRequired,
    refTreeStatus: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
};
