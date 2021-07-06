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

    content(label, value) {
        return (
            <div>
                {label}:&nbsp;
                <span>{value}</span>
            </div>
        )
    }

    resultsCount() {
        const { interview, interviewSearchResults } = this.props;

        const searchResults = interviewSearchResults[interview.archive_id];
        return searchResultCount(searchResults);
    }

    typologies(){
        const { interviewee, locale } = this.props;

        if (interviewee?.typology && interviewee.typology[locale]) {
            return this.content(t(this.props, 'typologies'), interviewee.typology[locale].join(', '), "");
        }
    }

    columns(){
        const { interviewee } = this.props;

        let props = this.props;
        let cols = this.props.project.list_columns.map(function(column, i){
            let obj = (column.ref_object_type === 'Interview' || column.source === 'Interview') ?
                props.interview :
                interviewee;
            if (obj) {
                return (
                    <td key={column.name} >
                        {humanReadable(obj, column.name, props, {})}
                    </td>
                );
            }
        })
        if (this.props.fulltext && this.resultsCount() > 0) {
            cols.push(
                <td>
                    <Link className={'search-result-link'}
                        onClick={() => {
                            this.props.setArchiveId(this.props.interview.archive_id);
                        }}
                        to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
                    >
                        {this.resultsCount()}
                    </Link>
                </td>
            );
        }
        return cols;
    }

    renderExportCheckbox() {
        const { interview, selectedArchiveIds, addRemoveArchiveId } = this.props;

        if (admin(this.props, interview, 'show') && admin(this.props, {type: 'General'}, 'edit')) {
            return (
                <td>
                    <input
                        type='checkbox'
                        className='export-checkbox'
                        checked={selectedArchiveIds.indexOf(interview.archive_id) > 0}
                        onChange={() => {addRemoveArchiveId(interview.archive_id)}}
                    />
                </td>
            );
        } else {
            return null;
        }
    }

    title() {
        const { interview, project, locale } = this.props;

        if (project.is_catalog) {
            return interview.title && interview.title[locale];
        } else {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        {interview.short_title && interview.short_title[locale]}
                        {
                            interview.workflow_state === 'unshared' && (
                                <FaEyeSlash />
                            )
                        }
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                        {project.fullname_on_landing_page ? interview.title[locale] : interview.anonymous_title[locale]}
                    </AuthShowContainer>
                </div>
            )
        }
    }

    render() {
        const { interview, fulltext, setArchiveId, searchInInterview } = this.props;

        return (
            <tr>
                {this.renderExportCheckbox()}
                <td>
                    <Link className={'search-result-link'}
                        onClick={() => {
                            setArchiveId(interview.archive_id);
                            searchInInterview(`${pathBase(this.props)}/searches/interview`, { fulltext, id: interview.archive_id });
                        }}
                        to={pathBase(this.props) + '/interviews/' + interview.archive_id}
                    >
                        {this.title()}
                    </Link>
                </td>
                {this.columns()}
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
