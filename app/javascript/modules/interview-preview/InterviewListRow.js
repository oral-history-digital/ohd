import PropTypes from 'prop-types';
import { FaEyeSlash } from 'react-icons/fa';
import queryString from 'query-string';

import { Checkbox } from 'modules/ui';
import { useProject, LinkOrA } from 'modules/routes';
import { useHumanReadable } from 'modules/data';
import { formatEventShort } from 'modules/events';
import { useI18n } from 'modules/i18n';
import { useProjectAccessStatus, useAuthorization } from 'modules/auth';
import { useInterviewSearch } from 'modules/interview-search';
import { useArchiveSearch } from 'modules/search';
import { usePersonWithAssociations } from 'modules/person';
import {
    METADATA_SOURCE_EVENT_TYPE,
    METADATA_SOURCE_INTERVIEW
} from 'modules/constants';

export default function InterviewListRow({
    interview,
    projects,
    selectedArchiveIds,
    setArchiveId,
    addRemoveArchiveId,
}) {
    const { locale } = useI18n();
    const { humanReadable } = useHumanReadable();
    const { project } = useProject();
    const projectOfInterview = projects[interview.project_id];
    const { isAuthorized } = useAuthorization();
    const { projectAccessGranted } = useProjectAccessStatus(projectOfInterview);
    const { fulltext } = useArchiveSearch();
    const { numResults } = useInterviewSearch(interview.archive_id, fulltext, projectOfInterview);
    const { data: interviewee } = usePersonWithAssociations(interview.interviewee_id);

    function linkPath() {
        const params = { fulltext };
        const paramStr = queryString.stringify(params, { skipNull: true });
        return `interviews/${interview.archive_id}?${paramStr}`;
    }

    function showCheckboxes() {
        return isAuthorized(interview, 'show') &&
            isAuthorized({ type: 'General' }, 'edit');
    }

    return (
        <tr className="Table-row">
            {
                showCheckboxes() && (
                    <td className="Table-cell">
                        <Checkbox
                            className="export-checkbox"
                            checked={selectedArchiveIds.indexOf(interview.archive_id) > 0}
                            onChange={() => addRemoveArchiveId(interview.archive_id)}
                        />
                    </td>
                )
            }
            <td className="Table-cell">
                <LinkOrA
                    project={projectOfInterview}
                    to={linkPath()}
                    onLinkClick={() => setArchiveId(interview.archive_id)}
                    className="search-result-link"
                >
                    {
                        projectAccessGranted ?
                            <div>
                                {interview.short_title && interview.short_title[locale]}
                                {
                                    interview.workflow_state === 'unshared' && (
                                        <FaEyeSlash className="u-ml-tiny" />
                                    )
                                }
                            </div> :
                            interview.anonymous_title[locale]
                    }
                </LinkOrA>
            </td>
            {
                project.list_columns?.map(column => {
                    const obj = (column.ref_object_type === 'Interview' || column.source === METADATA_SOURCE_INTERVIEW) ?
                        interview :
                        interviewee;

                    if (column.source === METADATA_SOURCE_EVENT_TYPE) {
                        const events = interviewee?.events?.filter(e =>
                            e.event_type_id === column.event_type_id);

                        const formattedEvents = events
                            ?.map(e => formatEventShort(e, locale))
                            ?.join(', ');

                        return (
                            <td key={column.name} className="Table-cell">
                                {formattedEvents}
                            </td>
                        );
                    }

                    return (
                        <td key={column.name} className="Table-cell">
                            {obj && humanReadable({obj, attribute: column.name, optionsScope: 'search_facets'})}
                        </td>
                    );
                })
            }
            {
                fulltext && numResults > 0 && (
                    <td className="Table-cell">
                        <LinkOrA
                            project={projectOfInterview}
                            to={linkPath()}
                            onLinkClick={() => setArchiveId(interview.archive_id)}
                            className="search-result-link"
                        >
                            {numResults}
                        </LinkOrA>
                    </td>
                )
            }
        </tr>
    );
}

InterviewListRow.propTypes = {
    interview: PropTypes.object,
    projects: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
};
