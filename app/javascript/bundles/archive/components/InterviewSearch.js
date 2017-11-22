import React from 'react';

import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import InterviewSearchFormContainer from '../containers/InterviewSearchFormContainer';

export default class InterviewSearch extends React.Component {

    renderSegments() {
        if(this.props.foundSegments) {
            return this.props.foundSegments.map( (segment, index) => {
                return (
                    <FoundSegmentContainer
                        data={segment}
                        key={"segment-" + segment.id}
                    />
                )
            })
        }
    }


    render () {
        let count = this.props.foundSegments ? this.props.foundSegments.length : 0;
        return (
            <div>
                <InterviewSearchFormContainer />
                <div className="content-search-legend"><p>{count} Ergebnisse</p></div>
                {this.renderSegments()}
            </div>
        );
    }
}

