import React from 'react';

import SegmentContainer from '../containers/SegmentContainer';
import InterviewSearchFormContainer from '../containers/InterviewSearchFormContainer';

export default class InterviewSearch extends React.Component {

    renderSegments() {
        if(this.props.foundSegments) {
            return this.props.foundSegments.map( (segment, index) => {
                segment.locale = this.props.locale;
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
                <InterviewSearchFormContainer />
                {this.renderSegments()}
            </div>
        );
    }
}

