import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation } from 'react-router-dom'
import request from 'superagent';
import '../css/locations'

export default class Locations extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      locations: [],
      zoom: 13
    }
  }

  componentDidMount() {
    this.loadLocations();
  }

  loadLocations() {
    debugger;
    let url = '/de/locations?archive_id=' + this.context.router.route.match.params.archiveId;
    request.get(url)
      .set('Accept', 'application/json')
      .end( (error, res) => {
        if (res) {
          if (res.error) {
            console.log("loading locations failed: " + error);
          } else {
            let json = JSON.parse(res.text);
            this.setState({ 
              locations: json.segment_ref_locations,
              segment_ref_locations: json.segment_ref_locations,
              interview_ref_locations: json.interview_ref_locations
            });
          }
        }
      });
  }

  position() {
    if(this.state.locations.length > 0) {
      let first = this.state.locations[0];
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
        {this.state.locations.map( (loc, index) => {
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
