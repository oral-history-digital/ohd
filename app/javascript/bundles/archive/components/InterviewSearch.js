import React from 'react';

import Loader from '../../../lib/loader'
import Segment from '../components/Segment';
import SearchForm from '../components/SearchForm';

export default class InterviewSearch extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            segments: [],
            facets: [],
        }
    }

    searchSegments() {
        Loader.getJson(this.props.url, null, this.setState.bind(this));
    }

    renderSegments() {
        if(this.state.segments) {
            return this.state.segments.map( (segment, index) => {
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

