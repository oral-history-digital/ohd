import classNames from 'classnames';

import MediaControlsContainer from '../containers/MediaControlsContainer';
import MediaElementContainer from '../containers/MediaElementContainer';
import MediaPlayerButtonsContainer from '../containers/MediaPlayerButtonsContainer';
import MediaPlayerTitle from './MediaPlayerTitle';

export default function MediaPlayer() {
    return (
        <div className={classNames('Layout-mediaPlayer', 'MediaPlayer')}>
            <div className="MediaPlayer-inner">
                <MediaElementContainer />
                <header className={classNames('MediaHeader')}>
                    <MediaPlayerTitle className="MediaHeader-title" />
                    <MediaControlsContainer className="MediaHeader-controls" />
                    <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
                </header>
            </div>
        </div>
    );
}
