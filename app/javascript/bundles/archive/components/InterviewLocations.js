import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {Navigation} from 'react-router-dom'
import LocationsContainer from '../containers/LocationsContainer'
import moment from 'moment';
import { t } from '../../../lib/utils';

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

    placeOfBirth(ref) {
        if (ref.descriptor[this.props.locale]) {
            return (
                <p>
                    {`${t(this.props, 'place_of_birth')}: ${ref.descriptor[this.props.locale]}`}
                </p>
            )
        }
    }

    popupContent(ref) {
        if (ref.ref_object) {
            return (
                <div>
                    <p>
                        {ref.desc[this.props.locale]}
                    </p>
                    <div className='time active_map_popup_text'>
                        {moment.utc(ref.ref_object.start_time * 1000).format("HH:mm:ss")}
                    </div>
                    <div className='time active_map_popup_text'>
                        {ref.ref_object.transcripts[this.props.locale]}
                    </div>
                </div>
            )
        } else if (ref.descriptor) {
            return (
                <div>
                    {this.placeOfBirth(ref)}
                    <div>
                        {`${ref.names[this.props.locale].firstname} ${ref.names[this.props.locale].lastname}`}
                    </div>
                </div>
            )
        } else {
            return (
                <p>
                    {ref.desc[this.props.locale]}
                </p>
            )
        }
    }

    render() {
        let locations = this.props.locations[this.props.archiveId];
        if (locations && this.props.placeOfBirth) {
            locations.push(this.props.placeOfBirth);
        }
        return (
            <div>
                <div className='explanation'>{t(this.props, 'interview_map_explanation')}</div>
                <LocationsContainer
                    data={locations}
                    loaded={this.locationsLoaded()}
                    handleClick={this.handleClick.bind(this)}
                    popupContent={this.popupContent.bind(this)}
                />
            </div>
        );
    }

}
