import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {Navigation} from 'react-router-dom'
import LocationsContainer from '../containers/LocationsContainer'
import moment from 'moment';
import ArchiveUtils from "../../../lib/utils";

export default class InterviewLocations extends React.Component {

    static contextTypes = {
        router: PropTypes.object
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
        if (ref.ref_object) {
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
        } else if (ref.descriptor) {
            return (
                <div>
                    <h3>
                        {`${ArchiveUtils.translate(this.props, 'place_of_birth')}: ${ref.descriptor[this.props.locale]}`}
                    </h3>
                    <div>
                        {`${ref.names[this.props.locale].firstname} ${ref.names[this.props.locale].lastname}`}
                    </div>
                </div>
            )
        } else {
            return (
                <h3>
                    {ref.desc[this.props.locale]}
                </h3>
            )
        }
    }

    render() {
        let locations = this.props.locations[this.props.archiveId];
        if (locations && this.props.placeOfBirth) {
            locations.push(this.props.placeOfBirth);
        }
        return (
            <LocationsContainer
                data={locations}
                loaded={this.locationsLoaded()}
                handleClick={this.handleClick.bind(this)}
                popupContent={this.popupContent.bind(this)}
            />
        );
    }

}
