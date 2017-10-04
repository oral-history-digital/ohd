import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation } from 'react-router-dom'
import '../../../css/locations'

export default class Locations extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      zoom: 13
    }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentDidMount() {
    if (!this.locationsLoaded()) {
      this.props.fetchLocations(this.context.router.route.match.params.archiveId);
    }
  }

  locationsLoaded() {
    return !this.props.isFetchingInterview && this.props.segments && this.props.archiveId === this.context.router.route.match.params.archiveId
  }

  position() {
    if(this.locationsLoaded()) {
      let ref = this.props.segments[0].references[0];
      return [ref.latitude, ref.longitude];
    }
  }

  markers() {
    let markers = [];

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
    return markers;
  }

  render() {
      return(
        <Map center={this.position()} zoom={this.state.zoom}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.markers()}
        </Map>
      );
  }

}
