import React from 'react';
//import { Video } from 'react-videojs';
import { Player } from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css"; // import css


        //<Video src={this.props.source} />
export default class Interview extends React.Component {

  render () {
    return (
      <div>
         <Player
            playsInline
            src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
          />
        <p> Bla </p>
      </div>
    );
  }
}

Interview.propTypes = {
  source: React.PropTypes.string
};
