import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import '../css/locations'
import i1 from '../../../images/layers.png';
import i2 from '../../../images/layers-2x.png';
import i3 from '../../../images/marker-icon.png';
import i4 from '../../../images/marker-icon-2x.png';
import i5 from '../../../images/marker-shadow.png';
import countriesJson from '../data/eur.geo.high-res.json';
import '../../../css/leaflet';

export default class Countries extends React.Component {

  map(position, zoom){
    return(
      <Map center={position} zoom={zoom}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON data={countriesJson}/>
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

