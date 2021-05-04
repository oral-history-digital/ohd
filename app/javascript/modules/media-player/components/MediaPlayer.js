import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { fullname } from 'modules/people';
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

    return (
        <div className={classNames('Layout-mediaPlayer', 'MediaPlayer', {
            'is-fixed': false, // transcriptScrollEnabled,//
        })}>
            <header className={classNames('MediaHeader', {
                'is-fixed': false // transcriptScrollEnabled,//
            })}>
                <h1 className="MediaHeader-title">
                    {fullname({ locale }, interviewee, true)}
                </h1>

                <MediaControlsContainer
                    className="MediaHeader-controls"
                    fixed={false}
                />
            </header>
            <div className={classNames('MediaElement', {
                'is-fixed': false, // transcriptScrollEnabled,//
            })}>
                <MediaElementContainer />
            </div>

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}

MediaPlayer.propTypes = {
    interviewee: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
};
