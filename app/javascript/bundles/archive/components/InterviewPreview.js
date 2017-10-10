import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

export default class InterviewPreview extends React.Component {

    renderInterviewSegments() {
        if (this.props.foundSegmentsForInterview.length > 0) {
            return (
                <Link
                    to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
                >
                    <p>{this.props.foundSegmentsForInterview.length}</p>
                </Link>
            )
        }
    }


    render() {
        return (
            <div className='interview-preview search-result'>
                <Link
                    onClick={this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id})}
                    to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
                >
                    <img src={this.props.interview.still_url}/>
                    <h3>{this.props.interview.short_title[this.props.locale]}</h3>
                </Link>
            </div>
        );
    }
}

