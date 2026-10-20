import { useAuthorization, useProjectAccessStatus } from 'modules/auth';
import {
    METADATA_SOURCE_EVENT_TYPE,
    METADATA_SOURCE_INTERVIEW,
} from 'modules/constants';
import {
    getCurrentUser,
    getResultMetadataFields,
    useHumanReadable,
    useProjectDetail,
} from 'modules/data';
import { formatEventShort } from 'modules/events';
import { useI18n } from 'modules/i18n';
import { useInterviewSearch } from 'modules/interview-search';
import { usePersonWithAssociations } from 'modules/person';
import { LinkOrA, useProject } from 'modules/routes';
import { useArchiveSearch } from 'modules/search';
import { Checkbox } from 'modules/ui';
import { localizedValue } from 'modules/utils';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FaEyeSlash, FaKey } from 'react-icons/fa';
import { useSelector } from 'react-redux';

/**
 * Shows an interview row with project links and access settings loaded through Redux.
 * Metadata columns follow the current project's configuration loaded through Redux.
 *
 * @param {Object} props - Row properties.
 * @param {Object} props.interview - Interview summary.
 * @param {string[]} props.selectedArchiveIds - Interviews selected for export.
 * @param {Function} props.setArchiveId - Selects the interview for navigation.
 * @param {Function} props.addRemoveArchiveId - Toggles export selection.
 * @returns {React.ReactElement} Interview table row.
 */
export default function InterviewListRow({
    interview,
    selectedArchiveIds,
    setArchiveId,
    addRemoveArchiveId,
}) {
    const { locale } = useI18n();
    const { humanReadable } = useHumanReadable();
    const { project } = useProject({ include: ['metadata_fields'] });
    const columns = getResultMetadataFields(project?.metadata_fields, 'table');
    const { project: projectOfInterview } = useProjectDetail(
        interview.project_id
    );
    const { isAuthorized } = useAuthorization();
    const { projectAccessGranted } = useProjectAccessStatus(projectOfInterview);
    const { fulltext } = useArchiveSearch();
    const { numResults } = useInterviewSearch(
        interview.archive_id,
        fulltext,
        projectOfInterview
    );
    const { data: interviewee } = usePersonWithAssociations(
        interview.interviewee_id
    );
    const currentUser = useSelector(getCurrentUser);
    const permitted = currentUser?.interview_permissions.some(
        (p) => p.interview_id === interview.id
    );
    const isRestricted = interview.workflow_state === 'restricted';
    const projectName =
        localizedValue(projectOfInterview?.display_name, locale) ||
        localizedValue(projectOfInterview?.name, locale, { emptyValue: '' });

    function linkPath() {
        const params = { fulltext };
        const paramStr = queryString.stringify(params, { skipNull: true });
        return `interviews/${interview.archive_id}?${paramStr}`;
    }

    function showCheckboxes() {
        return (
            isAuthorized(interview, 'show') &&
            isAuthorized({ type: 'General' }, 'edit')
        );
    }

    return (
        <tr className="Table-row">
            {showCheckboxes() && (
                <td className="Table-cell">
                    <Checkbox
                        className="export-checkbox"
                        checked={
                            selectedArchiveIds.indexOf(interview.archive_id) > 0
                        }
                        onChange={() =>
                            addRemoveArchiveId(interview.archive_id)
                        }
                    />
                </td>
            )}
            <td className="Table-cell">
                <LinkOrA
                    project={projectOfInterview}
                    to={linkPath()}
                    onLinkClick={() => setArchiveId(interview.archive_id)}
                    className="search-result-link"
                >
                    {projectAccessGranted &&
                    (interview.workflow_state === 'public' ||
                        (interview.workflow_state === 'restricted' &&
                            permitted) ||
                        isAuthorized(interview, 'update'))
                        ? interview.short_title?.[locale]
                        : interview.anonymous_title[locale]}
                    {interview.workflow_state === 'unshared' && (
                        <FaEyeSlash className="u-ml-tiny" />
                    )}
                    {interview.workflow_state === 'restricted' && (
                        <FaKey
                            className="u-ml-tiny"
                            style={{
                                filter: permitted
                                    ? 'opacity(40%)'
                                    : 'opacity(90%)',
                            }}
                        />
                    )}
                </LinkOrA>
            </td>
            {project?.is_umbrella && (
                <td className="Table-cell">{projectName}</td>
            )}
            {columns.map((column) => {
                const allowedToSee =
                    !isRestricted ||
                    (isRestricted && column.display_on_landing_page) ||
                    (isRestricted && permitted) ||
                    isAuthorized(interview, 'update');

                const obj =
                    column.ref_object_type === 'Interview' ||
                    column.source === METADATA_SOURCE_INTERVIEW
                        ? interview
                        : interviewee;

                if (column.source === METADATA_SOURCE_EVENT_TYPE) {
                    const events = interviewee?.events?.filter(
                        (e) => e.event_type_id === column.event_type_id
                    );

                    const formattedEvents = events
                        ?.map((e) => formatEventShort(e, locale))
                        ?.join(', ');

                    return (
                        <td key={column.name} className="Table-cell">
                            {allowedToSee ? formattedEvents : '---'}
                        </td>
                    );
                }

                return (
                    <td key={column.name} className="Table-cell">
                        {allowedToSee && obj
                            ? humanReadable({
                                  obj,
                                  attribute: column.name,
                                  optionsScope: 'search_facets',
                              })
                            : '---'}
                    </td>
                );
            })}
            {fulltext && numResults > 0 && (
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
            )}
        </tr>
    );
}

InterviewListRow.propTypes = {
    interview: PropTypes.object,
    selectedArchiveIds: PropTypes.array.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
};
