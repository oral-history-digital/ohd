import React from 'react';
import { render } from 'react-dom';
import { Navigation } from 'react-router-dom'
import LocationsContainer from '../containers/LocationsContainer'

export default class InterviewLocations extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    componentDidMount() {
        if (!this.locationsLoaded()) {
            this.props.fetchLocations(this.context.router.route.match.params.archiveId);
        }
    }

    locationsLoaded() {
        return this.props.locations[this.props.archiveId] && this.props.archiveId === this.context.router.route.match.params.archiveId
    }

    handleClick(segmentId, archiveId) {
        let time = this.getTimeForSegment(segmentId);
        this.props.handleSegmentClick(time);
    }

    getTimeForSegment(segmentId) {
        let segments = this.props.segments.filter(function (segment) {
              return segment.id === segmentId;
        });
        return segments[0].start_time;
    }

    render() {
        return(
            <LocationsContainer 
                data={this.props.locations[this.props.archiveId]} 
                loaded={this.locationsLoaded()}
                handleClick={this.handleClick.bind(this)}
            />
        );
    }

}
