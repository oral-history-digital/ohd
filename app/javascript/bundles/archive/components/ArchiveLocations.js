import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation } from 'react-router-dom'
import Locations from './Locations'
import '../../../css/locations'

export default class ArchiveLocations extends React.Component {

    locationsLoaded() {
        return false;
    }

    segments() {
        return [];
    }

    render() {
        return(
            <Locations 
                segments={this.props.segments} 
                interviews={this.props.foundInterviews}
                loaded={this.locationsLoaded()}
            />
        );
    }

}
