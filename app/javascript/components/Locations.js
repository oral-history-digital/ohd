import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation } from 'react-router-dom'
import Loader from '../lib/loader'
import '../css/locations'

export default class Locations extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      segment_ref_locations: [],
      zoom: 13
    }
  }

  componentDidMount() {
    Loader.getJson('/de/locations?archive_id=' + this.context.router.route.match.params.archiveId, null, this.setState.bind(this));
  }

  position() {
    if(this.state.segment_ref_locations.length > 0) {
      let first = this.state.segment_ref_locations[0];
      return [first.latitude, first.longitude];
    } else {
      return [37.9838, 23.7275];
    }
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    return(
      <Map center={this.position()} zoom={this.state.zoom}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {this.state.segment_ref_locations.map( (loc, index) => {
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
  }
                //<Link 
                  //className='interview-marker-link' 
                  //to={'/' + this.props..match.params.lang + '/interviews/' + this.props.match.params.archive_id} 
                //>
                  //<h3>{this.props.interview.short_title[this.props.lang]}</h3>
                //</Link>

}
