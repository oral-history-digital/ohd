import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';


export default class Locations extends React.Component {

    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            if (this.map) {
                this.map.leafletElement.invalidateSize();
                this.map.leafletElement.fitBounds(this.markersAndLocations().locations);
            }
        }
    }

    markersAndLocations() {
        let markers = [];
        let locations = [];

        if (this.props.data) {
            for (let i = 0; i < this.props.data.length; i++) {
                //for (let j = 0; j < this.props.data[i].references.length; j++) {

                    let ref = this.props.data[i];//.references[j];

                    if (ref.latitude) {
                        locations.push([ref.latitude, ref.longitude]);
                        markers.push(
                            <Marker position={[ref.latitude, ref.longitude]} key={`marker-${i}`} >
                                <Popup>
                                    <h3 onClick={() => this.props.handleClick(ref.ref_object_id, ref.archive_id)}>
                                    {ref.desc[this.props.locale]}
                                    </h3>
                                </Popup>
                            </Marker>
                        )
                    }
                //}
            }
        }
        return {markers: markers, locations: locations};
    }

    render() {
        let locations = this.markersAndLocations().locations;
        if (this.props.loaded && locations.length > 0) {
            return(
                <Map
                    bounds={locations}
                    maxZoom={16}
                    ref={(map) => { this.map = map; }}
                >
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MarkerClusterGroup maxClusterRadius={40}>
                        {this.markersAndLocations().markers}
                    </MarkerClusterGroup>
                </Map>
            );
        } else {
            return null;
        }
    }

}
