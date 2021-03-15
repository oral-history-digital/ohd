import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { humanReadable } from 'modules/data';
import { AuthShowContainer, admin } from 'modules/auth';
import loadIntervieweeWithAssociations from './loadIntervieweeWithAssociations';

export default class InterviewListRow extends React.Component {
    componentDidMount() {
        loadIntervieweeWithAssociations(this.props);
        if(this.props.fulltext) {
            this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
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
        let count = 0;
        if (
            this.props.interviewSearchResults &&
            this.props.interviewSearchResults[this.props.interview.archive_id] &&
            this.props.interviewSearchResults[this.props.interview.archive_id].foundSegments
        ) {
            count += this.props.interviewSearchResults[this.props.interview.archive_id].foundSegments.length +
                this.props.interviewSearchResults[this.props.interview.archive_id].foundPeople.length +
                this.props.interviewSearchResults[this.props.interview.archive_id].foundRegistryEntries.length +
                this.props.interviewSearchResults[this.props.interview.archive_id].foundBiographicalEntries.length;
        }
        return count;
    }

    typologies(){
        const { interviewee } = this.props;

        if (interviewee && interviewee.typology && interviewee.typology[this.props.locale]) {
            //if (interviewee.typology[this.props.locale] && interviewee.typology[this.props.locale].length > 1) {
                return this.content(t(this.props, 'typologies'), interviewee.typology[this.props.locale].join(', '), "");
            //} else if (interviewee.typology && interviewee.typology[this.props.locale].length == 1) {
                //return this.content(t(this.props, 'typology'), interviewee.typology[this.props.locale][0], "");
            //}
        }
    }

    columns(){
        const { interviewee } = this.props;

        let props = this.props;
        let state = this.state;
        let cols = this.props.project.list_columns.map(function(column, i){
            let obj = (column.ref_object_type === 'Interview' || column.source === 'Interview') ?
                props.interview :
                interviewee;
            return (
                <td key={column.name} >
                    {humanReadable(obj, column.name, props, {})}
                </td>
            );
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
        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            return <td>
                <input
                    type='checkbox'
                    className='export-checkbox'
                    checked={this.props.selectedArchiveIds.indexOf(this.props.interview.archive_id) > 0}
                    onChange={() => {this.props.addRemoveArchiveId(this.props.interview.archive_id)}}
                />
            </td>
        } else {
            return null;
        }
    }

    unsharedIcon() {
        if (this.props.interview.workflow_state === 'unshared') {
            return(<i className="fa fa-eye-slash"  aria-hidden="true"></i>)
        }
    }

    title() {
        if (this.props.project.is_catalog) {
            return this.props.interview.title && this.props.interview.title[this.props.locale];
        } else {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        {this.props.interview.short_title && this.props.interview.short_title[this.props.locale]}{this.unsharedIcon()}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                        {this.props.project.fullname_on_landing_page ? this.props.interview.title[this.props.locale] : this.props.interview.anonymous_title[this.props.locale]}
                    </AuthShowContainer>
                </div>
            )
        }
    }

    render() {
        return (
            <tr>
                {this.renderExportCheckbox()}
                <td>
                    <Link className={'search-result-link'}
                        onClick={() => {
                            this.props.setArchiveId(this.props.interview.archive_id);
                            this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                        }}
                        to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
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
    interviewee: PropTypes.object.isRequired,
};
