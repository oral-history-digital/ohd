import React from 'react';

import Segment from '../components/Segment';
import SearchForm from '../components/SearchForm';
import INTERVIEW_SEARCH_URL from '../constants/archiveConstants';

export default class InterviewSearch extends React.Component {


    searchSegments(query) {
        this.props.searchInInterview(INTERVIEW_SEARCH_URL, query);
    }

    renderSegments() {
        if(this.props.segments) {
            return this.props.segments.map( (segment, index) => {
                segment.lang = this.props.lang;
                return (
                    <Segment
                        data={segment}
                        key={"segment-" + segment.id}
                        handleClick={this.props.handleSegmentClick}
                    />
                )
            })
        }
    }

    render () {
        return (
            <div>
                <SearchForm
                    interviewId={this.props.interviewId}
                    searchSegments={this.searchSegments.bind(this)}
                />
                {this.renderSegments()}
            </div>
        );
    }
}

