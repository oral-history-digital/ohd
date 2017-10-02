import React from 'react';

import SegmentContainer from '../containers/SegmentContainer';
import SearchFormContainer from '../containers/SearchFormContainer';

export default class InterviewSearch extends React.Component {

    renderSegments() {
        if(this.props.segments) {
            return this.props.segments.map( (segment, index) => {
                segment.lang = this.props.lang;
                return (
                    <SegmentContainer
                        data={segment}
                        key={"segment-" + segment.id}
                    />
                )
            })
        }
    }

    render () {
        return (
            <div>
                <SearchFormContainer />
                {this.renderSegments()}
            </div>
        );
    }
}

