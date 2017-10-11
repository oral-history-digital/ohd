import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { DEFAULT_LOCATION } from '../constants/archiveConstants';
import '../../../css/locations'

export default class Locations extends React.Component {

    markersAndLocations() {
        let markers = [];
        let locations = [];

        for (let i = 0; i < this.props.data.length; i++) {
            for (let j = 0; j < this.props.data[i].references.length; j++) {

                let ref = this.props.data[i].references[j];

                if (ref.latitude) {
                    locations.push([ref.latitude, ref.longitude]);
                    markers.push(
                        <Marker position={[ref.latitude, ref.longitude]} key={`marker-${i}-${j}`} >
                            <Popup>
                                <h3 onClick={() => this.props.handleClick(this.props.data[i].start_time, this.props.data[i].archive_id)}>
                                {ref.desc[this.props.locale]}
                                </h3>
                            </Popup>
                        </Marker>
                    )
                }
            }
        }
        debugger;
        return {markers: markers, locations: locations};
    }

    render() {
        if (this.props.loaded && this.markersAndLocations().locations.length > 0) {
            return(
                <Map
                    bounds={this.markersAndLocations().locations}
                    boundsOptions={{padding: [30, 30]}}
                >
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {this.markersAndLocations().markers}
                </Map>
            );
        } else {
            return null;
        }
    }

}
