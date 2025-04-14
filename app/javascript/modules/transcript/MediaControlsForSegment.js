import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    updateMediaTime, updateIsPlaying, sendTimeChangeRequest,
    clearTimeChangeRequest
} from '../media-player/actions'
import {
    getCurrentTape, getTimeChangeRequest,
    getTimeChangeRequestAvailable
} from '../media-player/selectors';

import { AiFillPlayCircle } from "react-icons/ai";
import { HiPauseCircle } from "react-icons/hi2";
import { FaBackward } from "react-icons/fa";
import { FaForward } from "react-icons/fa";

import { formatTimecode } from 'modules/interview-helpers';

const KEYCODE_SPACE = 32;

function MediaControlsForSegment({
    className,
    updateIsPlaying,
    updateMediaTime,
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (window.mainPlayerInstance) {
            const mainPlayerIsPlaying = !window.mainPlayerInstance.paused();
            setIsPlaying(mainPlayerIsPlaying);

            const mainPlayerTime = window.mainPlayerInstance.currentTime();
            setCurrentTime(mainPlayerTime);

            if (mainPlayerIsPlaying) {
                updateIsPlaying(true);
                updateMediaTime(mainPlayerTime);
            }

            window.mainPlayerInstance.on('timeupdate', handleMainPlayerTimeUpdate);
            window.mainPlayerInstance.on('play', handleMainPlayerPlay);
            window.mainPlayerInstance.on('pause', handleMainPlayerPause);

            return () => {
                if (window.mainPlayerInstance) {
                    window.mainPlayerInstance.off('timeupdate', handleMainPlayerTimeUpdate);
                    window.mainPlayerInstance.off('play', handleMainPlayerPlay);
                    window.mainPlayerInstance.off('pause', handleMainPlayerPause);
                }
            };
        }
    }, []);

    useEffect(() => {
        if (isFocused) {
            const handleKeyDown = (event) => {
                if (event.keyCode === KEYCODE_SPACE) {
                    event.preventDefault();
                    handlePlayToggle();
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isFocused, isPlaying]);

    function handleMainPlayerTimeUpdate() {
        if (window.mainPlayerInstance) {
            const newTime = window.mainPlayerInstance.currentTime();
            setCurrentTime(newTime);
            updateMediaTime(newTime);
        }
    }

    function handleMainPlayerPlay() {
        setIsPlaying(true);
        updateIsPlaying(true);
    }

    function handleMainPlayerPause() {
        setIsPlaying(false);
        updateIsPlaying(false);
    }

    function handleTimeChange(newTime) {
        if (window.mainPlayerInstance) {
            window.mainPlayerInstance.currentTime(newTime);
            setCurrentTime(newTime);
            updateMediaTime(newTime);
        }
    }

    function handlePlayToggle() {
        if (window.mainPlayerInstance) {
            if (isPlaying) {
                window.mainPlayerInstance.pause();
            } else {
                window.mainPlayerInstance.play();
            }
        }
    }

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }



    return (
        <div
            className={classNames('SegmentMediaControls', className, {
                'SegmentMediaControls--focused': isFocused
            })}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <div className="SegmentMediaControls-wrapper">
                <div className="SegmentMediaControls-time">
                    {formatTimecode(currentTime)} / {window.mainPlayerInstance ? formatTimecode(window.mainPlayerInstance.duration() || 0) : '00:00:00'}
                </div>

                <div className="SegmentMediaControls-progressBar">
                    <input
                        type="range"
                        min="0"
                        max={window.mainPlayerInstance ? window.mainPlayerInstance.duration() || 100 : 100}
                        value={currentTime}
                        onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
                    />
                </div>

                <div className="SegmentMediaControls-buttons">
                    <FaBackward className='media-control-icon'
                        onClick={() => handleTimeChange(Math.max(0, currentTime - 5))} />
                    {isPlaying ?
                        <HiPauseCircle
                            onClick={handlePlayToggle}
                            className='media-control-icon' /> :
                        <AiFillPlayCircle
                            onClick={handlePlayToggle}
                            className='media-control-icon' />}
                    <FaForward
                        className='media-control-icon'
                        onClick={() => handleTimeChange(currentTime + 5)} />
                </div>
            </div>
        </div>
    );
}

MediaControlsForSegment.propTypes = {
    className: PropTypes.string,
    interview: PropTypes.object,
    tape: PropTypes.number,
    timeChangeRequest: PropTypes.number,
    timeChangeRequestAvailable: PropTypes.bool,
    updateIsPlaying: PropTypes.func.isRequired,
    updateMediaTime: PropTypes.func.isRequired,
    sendTimeChangeRequest: PropTypes.func,
    clearTimeChangeRequest: PropTypes.func,
};

const mapStateToProps = state => ({
    tape: getCurrentTape(state),
    timeChangeRequest: getTimeChangeRequest(state),
    timeChangeRequestAvailable: getTimeChangeRequestAvailable(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateMediaTime,
    updateIsPlaying,
    sendTimeChangeRequest,
    clearTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaControlsForSegment);