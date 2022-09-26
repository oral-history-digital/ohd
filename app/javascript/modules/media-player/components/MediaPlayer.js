import PropTypes from 'prop-types';
import classNames from 'classnames';

import { fullName } from 'modules/people';
import { Spinner } from 'modules/spinners';
import MediaControlsContainer from './MediaControlsContainer';
import MediaElementContainer from './MediaElementContainer';
import MediaPlayerButtonsContainer from './MediaPlayerButtonsContainer';

export default function MediaPlayer({
    interviewee,
    locale,
    projectId,
}) {
    if (!projectId) {
        return null;
    }

    if (!interviewee) {
        return <Spinner />;
    }

    return (
        <div
            className={classNames('Layout-mediaPlayer', 'MediaPlayer')}
        >
            <header className="MediaHeader">
                <h1 className="MediaHeader-title">
                    {fullName(interviewee, locale, true)}
                </h1>
                <MediaControlsContainer className="MediaHeader-controls" />
            </header>

            <MediaElementContainer />

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}

MediaPlayer.propTypes = {
    interviewee: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
};
