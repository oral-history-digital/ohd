import React from 'react';
import { render } from 'react-dom';
import { Navigation } from 'react-router-dom'
import LocationsContainer from '../containers/LocationsContainer'
import moment from 'moment';

export default class InterviewLocations extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    componentDidMount() {
        if (!this.locationsLoaded()) {
            this.props.fetchLocations(this.props.archiveId);
            //this.props.fetchLocations(this.context.router.route.match.params.archiveId);
        }
    }

    locationsLoaded() {
        return this.props.locations[this.props.archiveId] && this.props.archiveId === this.context.router.route.match.params.archiveId
    }

    handleClick(segmentId, archiveId) {
        let segment = this.getSegment(segmentId);
        this.props.handleSegmentClick(segment.tape_nbr, segment.start_time);
    }
    //handleClick(tape_nbr, start_time) {
        //this.props.handleSegmentClick(tape_nbr, start_time);
    //}

    getSegment(segmentId) {
        let segments = this.props.segments.filter(function (segment) {
              return segment.id === segmentId;
        });
        return segments[0];
    }

    popupContent(ref) {
        return (
            <div>
                <h3>
                    {ref.desc[this.props.locale]}
                </h3>
                <div className='time'>
                    {moment.utc(ref.ref_object.start_time * 1000).format("HH:mm:ss")}
                </div>
                <div className='time'>
                    {ref.ref_object.transcripts[this.props.locale]}
                </div>
            </div>
        )
    }

    render() {
        return(
            <LocationsContainer 
                data={this.props.locations[this.props.archiveId]} 
                loaded={this.locationsLoaded()}
                handleClick={this.handleClick.bind(this)}
                popupContent={this.popupContent.bind(this)}
            />
        );
    }

}
