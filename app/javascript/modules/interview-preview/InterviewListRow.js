import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaEyeSlash } from 'react-icons/fa';

import { usePathBase } from 'modules/routes';
import { humanReadable } from 'modules/data';
import { useProjectAccessStatus } from 'modules/auth';
import { AuthShowContainer, useAuthorization } from 'modules/auth';
import loadIntervieweeWithAssociations from './loadIntervieweeWithAssociations';
import searchResultCount from './searchResultCount';

export default function InterviewListRow({
    project,
    projectId,
    projects,
    interview,
    interviewee,
    fulltext,
    interviewSearchResults,
    selectedArchiveIds,
    locale,
    translations,
    peopleStatus,
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
    isLoggedIn,
}) {
    const { isAuthorized } = useAuthorization();
    const { projectAccessGranted } = useProjectAccessStatus();
    const pathBase = usePathBase();
    const intervieweeId = interview.interviewee_id;

    useEffect(() => {
        if (projectAccessGranted) {
            loadIntervieweeWithAssociations({ interviewee, intervieweeId, peopleStatus, fetchData, locale, projectId, projects });
        }

        if (fulltext) {
            searchInInterview(`${pathBase}/searches/interview`, { fulltext, id: interview.archive_id });
        }
    }, [isLoggedIn]);

    const searchResults = interviewSearchResults[interview.archive_id];
    const resultCount = searchResultCount(searchResults);

    return (
        <tr>
            {
                isAuthorized(interview, 'show') && isAuthorized({ type: 'General' }, 'edit') && (
                    <td>
                        <input
                            type="checkbox"
                            className="export-checkbox"
                            checked={selectedArchiveIds.indexOf(interview.archive_id) > 0}
                            onChange={() => addRemoveArchiveId(interview.archive_id)}
                        />
                    </td>
                )
            }
            <td>
                <Link className="search-result-link"
                    onClick={() => {
                        setArchiveId(interview.archive_id);
                        searchInInterview(`${pathBase}/searches/interview`, { fulltext, id: interview.archive_id });
                    }}
                    to={`${pathBase}/interviews/${interview.archive_id}`}
                >
                    {
                        project.is_catalog ? (
                            interview.title?.[locale]
                        ) : (
                            <div>
                                <AuthShowContainer ifLoggedIn>
                                    {interview.short_title && interview.short_title[locale]}
                                    {
                                        interview.workflow_state === 'unshared' && (
                                            <FaEyeSlash />
                                        )
                                    }
                                </AuthShowContainer>
                                <AuthShowContainer ifLoggedOut ifNoProject>
                                    {interview.anonymous_title[locale]}
                                </AuthShowContainer>
                            </div>
                        )
                    }
                </Link>
            </td>
            {
                project.list_columns.map(column => {
                    let obj = (column.ref_object_type === 'Interview' || column.source === 'Interview') ?
                        interview :
                        interviewee;

                    return (
                        <td key={column.name}>
                            {obj && humanReadable(obj, column.name, { locale, translations, optionsScope: 'search_facets' }, {})}
                        </td>
                    );
                })
            }
            {
                fulltext && resultCount > 0 && (
                    <td>
                        <Link className="search-result-link"
                            onClick={() => setArchiveId(interview.archive_id)}
                            to={`${pathBase}/interviews/${interview.archive_id}`}
                        >
                            {resultCount}
                        </Link>
                    </td>
                )
            }
        </tr>
    );
}

InterviewListRow.propTypes = {
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    fulltext: PropTypes.string,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    interview: PropTypes.object,
    interviewee: PropTypes.object.isRequired,
    interviewSearchResults: PropTypes.object,
    project: PropTypes.object.isRequired,
    peopleStatus: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    searchInInterview: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
