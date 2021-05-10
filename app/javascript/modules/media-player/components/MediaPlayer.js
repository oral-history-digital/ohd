import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'debounce';

import { fullname } from 'modules/people';
import { SITE_HEADER_HEIGHT, MEDIA_PLAYER_HEIGHT_STATIC, MEDIA_PLAYER_HEIGHT_STICKY } from 'modules/constants';
import MediaControlsContainer from './MediaControlsContainer';
import MediaElementContainer from './MediaElementContainer';
import MediaPlayerButtonsContainer from './MediaPlayerButtonsContainer';

// TODO: Make the threshold fit for mobile, too.
const STICKY_THRESHOLD = SITE_HEADER_HEIGHT + MEDIA_PLAYER_HEIGHT_STATIC - MEDIA_PLAYER_HEIGHT_STICKY

export default function MediaPlayer({
    interviewee,
    locale,
    projectId,
    sticky,
    setSticky,
    unsetSticky,
}) {
    const handleScroll = (e) => {
        const scrollY = e.target.scrollingElement.scrollTop;

        if (scrollY > STICKY_THRESHOLD) {
            setSticky();
        } else {
            unsetSticky();
        }
    };

    const debouncedHandleScroll = debounce(handleScroll, 100);

    useEffect(() => {
        window.addEventListener('scroll', debouncedHandleScroll);

        const cleanup = () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
            unsetSticky();
        }

        return cleanup;
    }, []);

    if (!projectId) {
        return null;
    }

    return (
        <div
            className={classNames('Layout-mediaPlayer', 'MediaPlayer', { 'is-sticky': sticky })}
        >
            <header className={classNames('MediaHeader', { 'is-sticky': sticky })}>
                <h1 className="MediaHeader-title">
                    {fullname({ locale }, interviewee, true)}
                </h1>
                <MediaControlsContainer className={classNames('MediaHeader-controls', { 'is-sticky': sticky })} />
            </header>

            <MediaElementContainer className={classNames({ 'is-sticky': sticky })} />

            <MediaPlayerButtonsContainer className="MediaPlayer-buttons" />
        </div>
    );
}

MediaPlayer.propTypes = {
    interviewee: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    sticky: PropTypes.bool.isRequired,
    setSticky: PropTypes.func.isRequired,
    unsetSticky: PropTypes.func.isRequired,
};
