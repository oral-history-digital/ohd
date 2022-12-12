import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaEyeSlash } from 'react-icons/fa';
import queryString from 'query-string';

import { Checkbox } from 'modules/ui';
import { usePathBase } from 'modules/routes';
import { humanReadable } from 'modules/data';
import { formatEventShort } from 'modules/events';
import { useI18n } from 'modules/i18n';
import { useProjectAccessStatus, useAuthorization } from 'modules/auth';
import { useInterviewSearch } from 'modules/interview-search';
import { useArchiveSearch } from 'modules/search';
import { usePersonWithAssociations } from 'modules/person';

export default function InterviewListRow({
    project,
    interview,
    selectedArchiveIds,
    languages,
    collections,
    setArchiveId,
    addRemoveArchiveId,
}) {
    const { locale, translations } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const pathBase = usePathBase();
    const { fulltext } = useArchiveSearch();
    const { numResults } = useInterviewSearch(interview.archive_id, fulltext);

    const { data: interviewee, isLoading } = usePersonWithAssociations(interview.interviewee_id);

    const params = { fulltext };
    const paramStr = queryString.stringify(params, { skipNull: true });
    const linkUrl = `${pathBase}/interviews/${interview.archive_id}?${paramStr}`;

    return (
        <tr className="Table-row">
            {
                isAuthorized(interview, 'show') && isAuthorized({ type: 'General' }, 'edit') && (
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
                <Link className="search-result-link"
                    onClick={() => {
                        setArchiveId(interview.archive_id);
                    }}
                    to={linkUrl}
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
                </Link>
            </td>
            {
                project.list_columns.map(column => {
                    const obj = (column.ref_object_type === 'Interview' || column.source === 'Interview') ?
                        interview :
                        interviewee;

                    if (column.source === 'EventType') {
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
                            {obj && humanReadable(obj, column.name, { locale, translations, languages, collections, optionsScope: 'search_facets' }, {})}
                        </td>
                    );
                })
            }
            {
                fulltext && numResults > 0 && (
                    <td className="Table-cell">
                        <Link className="search-result-link"
                            onClick={() => setArchiveId(interview.archive_id)}
                            to={`${pathBase}/interviews/${interview.archive_id}`}
                        >
                            {numResults}
                        </Link>
                    </td>
                )
            }
        </tr>
    );
}

InterviewListRow.propTypes = {
    interview: PropTypes.object,
    project: PropTypes.object.isRequired,
    languages: PropTypes.object.isRequired,
    collections: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
};
