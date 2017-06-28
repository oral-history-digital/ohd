import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import '../styles/locations'

class Locations extends React.Component {

  map(position, zoom){
    return(
      <Map center={position} zoom={zoom}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    );
  }

  render() {
    return <div>
             {this.map(this.props.position, this.props.zoom)}
           </div>; 
  }

}
module.exports = Locations
