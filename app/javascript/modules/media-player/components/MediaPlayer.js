import React, { useRef, useEffect } from 'react';
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
    sticky,
    setSticky,
    unsetSticky,
}) {
    const divEl = useRef(null);

    const listener = (e) => {
        const scrollY = e.target.scrollingElement.scrollTop;

        if (scrollY > 408) {
            setSticky();
        } else {
            unsetSticky();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', listener);

        const cleanup = () => {
            window.removeEventListener('scroll', listener);
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

            <div className={classNames('MediaElement', { 'is-sticky': sticky })}>
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
    sticky: PropTypes.bool.isRequired,
    setSticky: PropTypes.func.isRequired,
    unsetSticky: PropTypes.func.isRequired,
};
