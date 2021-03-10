import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { fullname } from 'modules/people';
import VideoControlsContainer from './VideoControlsContainer';
import MediaElementContainer from './MediaElementContainer';
import VideoPlayerButtonsContainer from './VideoPlayerButtonsContainer';

export default function VideoPlayer({
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
        <div className={classNames('VideoPlayer', {
            'is-fixed': transcriptScrollEnabled,
            'is-narrow': flyoutTabsVisible && transcriptScrollEnabled,
        })}>
            <header className={classNames('VideoHeader', {
                'is-fixed': transcriptScrollEnabled,
            })}>
                <h1 className="VideoHeader-title">
                    {fullname({ locale }, interviewee, true)}
                </h1>

                <VideoControlsContainer />
            </header>
            <div className={classNames('VideoElement', {
                'is-fixed': transcriptScrollEnabled,
            })}>
                <MediaElementContainer />
            </div>

            <VideoPlayerButtonsContainer className="VideoPlayer-buttons" />
        </div>
    );
}

VideoPlayer.propTypes = {
    flyoutTabsVisible: PropTypes.bool.isRequired,
    interviewee: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    transcriptScrollEnabled: PropTypes.bool.isRequired,
};
