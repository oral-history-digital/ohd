import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { fullname } from 'modules/people';
import MediaControlsContainer from './MediaControlsContainer';
import MediaElementContainer from './MediaElementContainer';
import MediaPlayerButtonsContainer from './MediaPlayerButtonsContainer';

export default function MediaPlayer({
    flyoutTabsVisible,
    interviewee,
    locale,
    projectId,
    transcriptScrollEnabled,
}) {
    if (!projectId) {
        return null;
    }

    return (
        <div className={classNames('MediaPlayer', {
            'is-fixed': transcriptScrollEnabled,
            'is-narrow': flyoutTabsVisible && transcriptScrollEnabled,
        })}>
            <header className={classNames('MediaHeader', {
                'is-fixed': transcriptScrollEnabled,
            })}>
                <h1 className="MediaHeader-title">
                    {fullname({ locale }, interviewee, true)}
                </h1>

                <MediaControlsContainer />
            </header>
            <div className={classNames('MediaElement', {
                'is-fixed': transcriptScrollEnabled,
            })}>
                <MediaElementContainer />
            </div>

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}

MediaPlayer.propTypes = {
    flyoutTabsVisible: PropTypes.bool.isRequired,
    interviewee: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    transcriptScrollEnabled: PropTypes.bool.isRequired,
};