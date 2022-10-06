import PropTypes from 'prop-types';
import classNames from 'classnames';

import MediaPlayerTitle from './MediaPlayerTitle';
import MediaControlsContainer from './MediaControlsContainer';
import MediaElementContainer from './MediaElementContainer';
import MediaPlayerButtonsContainer from './MediaPlayerButtonsContainer';

export default function MediaPlayer({
    projectId,
}) {
    if (!projectId) {
        return null;
    }

    return (
        <div
            className={classNames('Layout-mediaPlayer', 'MediaPlayer')}
        >
            <header className="MediaHeader">
                <MediaPlayerTitle className="MediaHeader-title" />
                <MediaControlsContainer className="MediaHeader-controls" />
            </header>

            <MediaElementContainer />

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}

MediaPlayer.propTypes = {
    projectId: PropTypes.string.isRequired,
};
