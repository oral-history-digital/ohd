import { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { FaEyeSlash } from 'react-icons/fa';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { humanReadable } from 'modules/data';
import { AuthShowContainer, admin } from 'modules/auth';
import loadIntervieweeWithAssociations from './loadIntervieweeWithAssociations';
import searchResultCount from './searchResultCount';

export default class InterviewListRow extends Component {
    componentDidMount() {
        const { fulltext, interview, searchInInterview } = this.props;

        loadIntervieweeWithAssociations(this.props);
        if (fulltext) {
            searchInInterview(`${pathBase(this.props)}/searches/interview`, { fulltext, id: interview.archive_id });
        }
    }

    componentDidUpdate() {
        loadIntervieweeWithAssociations(this.props);
    }

    render() {
        const { project, interview, interviewee, fulltext, interviewSearchResults,
            selectedArchiveIds, locale, setArchiveId, searchInInterview,
            addRemoveArchiveId } = this.props;

        const searchResults = interviewSearchResults[interview.archive_id];
        const resultCount = searchResultCount(searchResults);

        return (
            <tr>
                {
                    admin(this.props, interview, 'show') && admin(this.props, {type: 'General'}, 'edit') && (
                        <td>
                            <input
                                type='checkbox'
                                className='export-checkbox'
                                checked={selectedArchiveIds.indexOf(interview.archive_id) > 0}
                                onChange={() => {addRemoveArchiveId(interview.archive_id)}}
                            />
                        </td>
                    )
                }
                <td>
                    <Link className="search-result-link"
                        onClick={() => {
                            setArchiveId(interview.archive_id);
                            searchInInterview(`${pathBase(this.props)}/searches/interview`, { fulltext, id: interview.archive_id });
                        }}
                        to={pathBase(this.props) + '/interviews/' + interview.archive_id}
                    >
                        {
                            project.is_catalog ? (
                                interview.title && interview.title[locale]
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
                                {obj && humanReadable(obj, column.name, this.props, {})}
                            </td>
                        );
                    })
                }
                {
                    fulltext && resultCount > 0 && (
                        <td>
                            <Link className="search-result-link"
                                onClick={() => setArchiveId(interview.archive_id)}
                                to={pathBase(this.props) + '/interviews/' + interview.archive_id}
                            >
                                {resultCount}
                            </Link>
                        </td>
                    )
                }
            </tr>
        );
    }
}

InterviewListRow.propTypes = {
    fulltext: PropTypes.string,
    locale: PropTypes.string.isRequired,
    interview: PropTypes.object,
    interviewee: PropTypes.object.isRequired,
    interviewSearchResults: PropTypes.object,
    project: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    searchInInterview: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
};
