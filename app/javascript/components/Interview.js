import React from 'react';
import { Player } from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css"; // import css

export default class Interview extends React.Component {

  render () {
    return (
      <div>
         <Player
            playsInline
            src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
          />
      </div>
    );
  }
}

Interview.propTypes = {
  source: React.PropTypes.string
};
