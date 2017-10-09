import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation } from 'react-router-dom'
import Locations from './Locations'
import '../../../css/locations'

export default class InterviewLocations extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
    }

    componentDidMount() {
        if (!this.locationsLoaded()) {
            this.props.fetchInterview(this.context.router.route.match.params.archiveId);
        }
    }

    locationsLoaded() {
        return !this.props.isFetchingInterview && this.props.segments && this.props.archiveId === this.context.router.route.match.params.archiveId
    }

    render() {
        return(
            <Locations 
              segments={this.props.segments} 
              loaded={this.locationsLoaded()}
            />
        );
    }

}
