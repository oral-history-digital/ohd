import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaEyeSlash } from 'react-icons/fa';

import { Checkbox } from 'modules/ui';
import { usePathBase } from 'modules/routes';
import { humanReadable } from 'modules/data';
import { useProjectAccessStatus, AuthShowContainer, useAuthorization } from
    'modules/auth';
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
    languages,
    collections,
    peopleStatus,
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
    isLoggedIn,
}) {
    const { isAuthorized } = useAuthorization();
    const { projectAccessGranted } = useProjectAccessStatus(project);
    const pathBase = usePathBase();
    const intervieweeId = interview.interviewee_id;

    useEffect(() => {
        if (!projectAccessGranted) {
            fetchData({ projectId, locale, projects }, 'people', interview.interviewee_id, 'landing_page_metadata');
        } else if (projectAccessGranted && !interviewee?.associations_loaded) {
            fetchData({ projectId, locale, projects }, 'people', interview.interviewee_id, null, 'with_associations=true');
        }

        if (fulltext) {
            searchInInterview(`${pathBase}/searches/interview`, { fulltext, id: interview.archive_id });
        }
    }, [projectAccessGranted, isLoggedIn, interviewee?.associations_loaded]);

    const searchResults = interviewSearchResults[interview.archive_id];
    const resultCount = searchResultCount(searchResults);

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
                        searchInInterview(`${pathBase}/searches/interview`, { fulltext, id: interview.archive_id });
                    }}
                    to={`${pathBase}/interviews/${interview.archive_id}`}
                >
                    {
                        project.is_catalog ? (
                            interview.anonymous_title[locale]
                        ) : (
                            <div>
                                <AuthShowContainer ifLoggedIn>
                                    {interview.short_title && interview.short_title[locale]}
                                    {
                                        interview.workflow_state === 'unshared' && (
                                            <FaEyeSlash className="u-ml-tiny" />
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
                        <td key={column.name} className="Table-cell">
                            {obj && humanReadable(obj, column.name, { locale, translations, languages, collections, optionsScope: 'search_facets' }, {})}
                        </td>
                    );
                })
            }
            {
                fulltext && resultCount > 0 && (
                    <td className="Table-cell">
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
