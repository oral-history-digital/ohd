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

  componentDidMount() {
    if (!this.locationsLoaded()) {
      this.props.fetchLocations(this.context.router.route.match.params.archiveId);
    }
  }

  locationsLoaded() {
    return this.props.segmentRefLocationsLoaded && this.props.archiveId === this.context.router.route.match.params.archiveId
  }

  position() {
    if(this.locationsLoaded()) {
      let first = this.props.segmentRefLocations[0];
      return [first.latitude, first.longitude];
    } else {
      return [37.9838, 23.7275];
    }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    if(this.locationsLoaded()) {
      return(
        <Map center={this.position()} zoom={this.state.zoom}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.props.segmentRefLocations.map( (loc, index) => {
            return (
              <Marker position={[loc.latitude, loc.longitude]} key={"marker-" + index} >
                <Popup>
                  <h3>{loc.descriptor}</h3>
                </Popup>
              </Marker>
            ) 
          })}
        </Map>
      );
    } else {
      return null;
    }
  }
                //<Link 
                  //className='interview-marker-link' 
                  //to={'/' + this.props..match.params.lang + '/interviews/' + this.props.match.params.archive_id} 
                //>
                  //<h3>{this.props.interview.short_title[this.props.lang]}</h3>
                //</Link>

}
