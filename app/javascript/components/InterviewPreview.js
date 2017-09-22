import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

export default class InterviewPreview extends React.Component {

    renderInterviewSegments() {
        if (this.props.segmentsForInterview.length > 0) {
            return (

                <Link
                    to={'/' + this.props.lang + '/interviews/' + this.props.interview.archive_id}
                >
                    <p>{this.props.segmentsForInterview.length}</p>
                </Link>

            )
        }
    }


    render() {
        return (
            <div className='interview-preview search-result'>
                <Link
                    to={'/' + this.props.lang + '/interviews/' + this.props.interview.archive_id}
                >
                    <img src={this.props.interview.still_url}/>
                    <h3>{this.props.interview.short_title[this.props.lang]}</h3>
                </Link>
                {this.renderInterviewSegments()}
            </div>
        );
    }
}

