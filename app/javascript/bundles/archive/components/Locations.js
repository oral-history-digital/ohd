import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation } from 'react-router-dom'
import '../../../css/locations'

export default class Locations extends React.Component {

    position() {
        if (this.props.loaded) {
            let ref = this.props.segments[0].references[0];
            if (ref !== undefined) {
                return [ref.latitude, ref.longitude];
            } else {
                return [null,null];
            }
        }
    }

    markers() {
        let markers = [];

        if (this.props.loaded) {
            for (let i = 0; i < this.props.segments.length; i++) {
                for (let j = 0; j < this.props.segments[i].references.length; j++) {

                    let ref = this.props.segments[i].references[j];

                    if (ref.latitude) {
                        markers.push(
                            <Marker position={[ref.latitude, ref.longitude]} key={`marker-${i}-${j}`} >
                                <Popup>
                                    <h3 onClick={() => this.props.handleSegmentClick(this.props.segments[i].start_time)}>
                                    {ref.desc[this.props.locale]}
                                    </h3>
                                </Popup>
                            </Marker>
                        )
                    }
                }
            }
        }
        return markers;
    }

    render() {
        return(
            <Map center={this.position()} zoom={13}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {this.markers()}
            </Map>
        );
    }

}
