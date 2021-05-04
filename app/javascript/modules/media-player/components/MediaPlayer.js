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

    const isSticky = false;

    return (
        <div
            className={classNames('Layout-mediaPlayer', 'MediaPlayer', {
                'is-sticky': isSticky,
                'is-fixed': isSticky, // transcriptScrollEnabled,//
            })}
        >
            <header className={classNames('MediaHeader', {
                'is-fixed': isSticky // transcriptScrollEnabled,//
            })}>
                <h1 className="MediaHeader-title">
                    {fullname({ locale }, interviewee, true)}
                </h1>

                <MediaControlsContainer
                    className="MediaHeader-controls"
                    fixed={isSticky}
                />
            </header>
            <div className={classNames('MediaElement', {
                'is-fixed': isSticky, // transcriptScrollEnabled,//
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
