import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BsGearFill } from 'react-icons/bs';
import { IoIosArrowForward } from 'react-icons/io';
import { LuSettings2 } from 'react-icons/lu';
import { MdSlowMotionVideo } from 'react-icons/md';
import getPlayerSources from '../getPlayerSources';
import getQualityLabel from '../getQualityLabel';
import manageControlVisibility from '../manageControlVisibility';

function ConfigurationMenu({ player, playbackRates, qualities, translations }) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showRateSubmenu, setShowRateSubmenu] = useState(false);
    const [showQualitySubmenu, setShowQualitySubmenu] = useState(false);
    const [selectedRate, setSelectedRate] = useState(player.playbackRate());

    // Initialize with player's current selected quality or a reasonable default
    const [selectedQuality, setSelectedQuality] = useState(() => {
        const sources = player?.sources || [];
        if (sources.length > 0) {
            const currentSrc = sources.find((s) => s.selected) || sources[0];
            return getQualityLabel(currentSrc);
        }
        return '480p';
    });

    // ------------------ Refs ------------------
    const rateMenuItemRef = useRef(null);
    const qualityMenuItemRef = useRef(null);
    const allSourcesRef = useRef([]);
    const videoElementRef = useRef(null); // Reference to the video element needed for PiP blocking

    // Use provided translations with fallbacks
    const t = (key) => {
        if (!translations) return key;
        return translations[key] || key;
    };

    // Initialize all sources once
    useEffect(() => {
        if (!player) return;

        const sources = getPlayerSources(player);
        if (sources.length > 0) {
            allSourcesRef.current = sources;
        }
    }, [player]);

    // Update quality display based on current selection
    useEffect(() => {
        if (!player) return;

        const updateQualityDisplay = () => {
            const sources = getPlayerSources(player);
            if (sources.length > 0) {
                // Update our source reference
                allSourcesRef.current = sources;

                const currentSrc =
                    sources.find((s) => s.selected) || sources[0];
                const newQuality = getQualityLabel(currentSrc);
                setSelectedQuality(newQuality);
            }
        };

        // Update immediately
        updateQualityDisplay();

        // Listen for source changes
        player.on('sourceset', updateQualityDisplay);
        player.on('loadstart', updateQualityDisplay);

        return () => {
            player.off('sourceset', updateQualityDisplay);
            player.off('loadstart', updateQualityDisplay);
        };
    }, [player]);

    const menuTimeout = useRef(null);
    const rateSubTimeout = useRef(null);
    const qualitySubTimeout = useRef(null);

    // Helper: Check if video is HLS/DASH
    const isHls = () =>
        (player.currentSource().type || '').includes('mpegURL') || player.vhs;

    // Wrapper for the control visibility manager
    const handleControlVisibility = useCallback(() => {
        manageControlVisibility(player);
    }, [player]);

    // Global event listeners
    useEffect(() => {
        if (!player) return;

        const onRate = () => setSelectedRate(player.playbackRate());
        player.on('ratechange', onRate);

        const afterEvt = () => setTimeout(handleControlVisibility, 0);
        player.on('sourceset', afterEvt);
        player.on('loadstart', afterEvt);
        player.on('fullscreenchange', afterEvt);

        handleControlVisibility(); // initial call

        return () => {
            player.off('ratechange', onRate);
            player.off('sourceset', afterEvt);
            player.off('loadstart', afterEvt);
            player.off('fullscreenchange', afterEvt);
        };
    }, [player, handleControlVisibility]);

    // Handler: Playback rate change
    const handlePlaybackRate = (rate) => {
        player.playbackRate(rate);
        setSelectedRate(rate);
        setShowRateSubmenu(false);
        setIsMenuVisible(false);
    };

    // Handler: Quality selection
    const handleQualitySelect = (qualityLabel) => {
        if (!player) return;

        // ----- HLS/DASH -----
        if (isHls()) {
            const reps = player.vhs?.representations?.() || [];
            reps.forEach((r) => {
                const wanted = qualityLabel.replace(/\D/g, '');
                r.enabled(!wanted || String(r.height) === wanted);
            });
            console.debug(`[Quality] (HLS) → ${qualityLabel}`);
        } else {
            // ----- Progressive MP4 -----
            const all = allSourcesRef.current;
            const selected = all.find(
                (s) => (s.label || `${s.height}p`) === qualityLabel
            );
            if (!selected) return;

            const time = player.currentTime();
            const wasPaused = player.paused();

            console.debug(`[Quality] (MP4) → ${qualityLabel}`);

            // Update selected state in all sources to maintain native quality selector compatibility
            const updatedSources = all.map((source) => ({
                ...source,
                selected: source === selected,
            }));

            // Update sources while preserving native quality selector state
            player.src(updatedSources);

            /* When loading starts, hide native controls and big-play if video was playing */
            player.one('loadstart', () => {
                setTimeout(handleControlVisibility, 0);
                if (!wasPaused) player.getChild('BigPlayButton')?.hide();
            });

            player.one('loadedmetadata', () => {
                player.currentTime(time);
                if (!wasPaused) player.play();
            });
        }

        // Update UI & close menus
        setSelectedQuality(qualityLabel);
        setTimeout(() => {
            setShowQualitySubmenu(false);
            setIsMenuVisible(false);
        }, 0);

        player.trigger('qualitySelected', { quality: qualityLabel });
    };

    // ------------------ Block Picture in Picture ------------------

    useEffect(() => {
        if (!player) return;

        // Get the actual HTML video element
        videoElementRef.current = player.el().querySelector('video');
    }, [player]);

    // Control standard PiP attribute for Chrome, Safari, etc.
    useEffect(() => {
        const videoElement = videoElementRef.current;
        if (!videoElement) return;

        if (showRateSubmenu || showQualitySubmenu) {
            // Disable PiP when submenus are open (works for Chrome, Safari, Edge)
            videoElement.disablePictureInPicture = true;
        } else {
            // Re-enable PiP when submenus are closed
            videoElement.disablePictureInPicture = false;
        }
    }, [showRateSubmenu, showQualitySubmenu]);

    // Apply Firefox-specific solution and other browser compatibility fixes
    useEffect(() => {
        if (!player) return;

        const videoEl = player.el();
        if (!videoEl) return;

        // Update the player class based on menu state
        if (showRateSubmenu || showQualitySubmenu) {
            videoEl.classList.add('pip-blocker');
        } else {
            videoEl.classList.remove('pip-blocker');
        }

        return () => {
            // Clean up when component unmounts
            if (videoEl) {
                videoEl.classList.remove('pip-blocker');
            }
        };
    }, [showRateSubmenu, showQualitySubmenu, player]);

    // Clear timeouts when unmounting
    useEffect(
        () => () => {
            clearTimeout(menuTimeout.current);
            clearTimeout(rateSubTimeout.current);
            clearTimeout(qualitySubTimeout.current);
        },
        []
    );

    // ------------------ UI ------------------
    return (
        <div
            className="vjs-configuration-menu-container"
            onMouseEnter={() => {
                clearTimeout(menuTimeout.current);
                setIsMenuVisible(true);
            }}
            onMouseLeave={() => {
                menuTimeout.current = setTimeout(() => {
                    setIsMenuVisible(false);
                    setShowRateSubmenu(false);
                    setShowQualitySubmenu(false);
                }, 100);
            }}
        >
            {/* Add overlay div that blocks clicks when any submenu is open */}
            {(showRateSubmenu || showQualitySubmenu) && (
                <div className="vjs-pip-interaction-blocker" />
            )}

            <Menu>
                <MenuButton className="vjs-configuration-menu-button">
                    <BsGearFill className="vjs-configuration-menu-icon" />
                </MenuButton>

                {isMenuVisible && (
                    <MenuList className="vjs-configuration-menu">
                        {/* Playback rate */}
                        <MenuItem
                            ref={rateMenuItemRef}
                            className="vjs-configuration-menu-item main-container"
                            onMouseEnter={() => {
                                clearTimeout(rateSubTimeout.current);
                                setShowRateSubmenu(true);
                            }}
                            onMouseLeave={() => {
                                rateSubTimeout.current = setTimeout(
                                    () => setShowRateSubmenu(false),
                                    100
                                );
                            }}
                        >
                            <div className="menu-item-title-container">
                                <MdSlowMotionVideo className="rate-icon" />
                                <span>{t('playbackRate')}</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>

                        {showRateSubmenu && (
                            <div
                                className="vjs-configuration-submenu horizontal-menu"
                                onMouseEnter={() => {
                                    clearTimeout(rateSubTimeout.current);
                                    setShowRateSubmenu(true);
                                }}
                                onMouseLeave={() => {
                                    rateSubTimeout.current = setTimeout(
                                        () => setShowRateSubmenu(false),
                                        100
                                    );
                                }}
                                style={{
                                    top: rateMenuItemRef.current
                                        ? rateMenuItemRef.current.offsetTop - 10
                                        : 0,
                                }}
                            >
                                {playbackRates.map((rate) => (
                                    <MenuItem
                                        key={rate}
                                        className={`vjs-configuration-submenu-item ${
                                            selectedRate === rate
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onSelect={() =>
                                            handlePlaybackRate(rate)
                                        }
                                    >
                                        {rate}x
                                    </MenuItem>
                                ))}
                            </div>
                        )}

                        <hr className="vjs-configuration-menu-divider" />

                        {/* Video quality */}
                        <MenuItem
                            ref={qualityMenuItemRef}
                            className="vjs-configuration-menu-item main-container"
                            onMouseEnter={() => {
                                clearTimeout(qualitySubTimeout.current);
                                setShowQualitySubmenu(true);
                            }}
                            onMouseLeave={() => {
                                qualitySubTimeout.current = setTimeout(
                                    () => setShowQualitySubmenu(false),
                                    100
                                );
                            }}
                        >
                            <div className="menu-item-title-container">
                                <LuSettings2 className="quality-icon" />
                                <span>{t('playbackQuality')}</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>

                        {showQualitySubmenu && (
                            <div
                                className="vjs-configuration-submenu horizontal-menu"
                                onMouseEnter={() => {
                                    clearTimeout(qualitySubTimeout.current);
                                    setShowQualitySubmenu(true);
                                }}
                                onMouseLeave={() => {
                                    qualitySubTimeout.current = setTimeout(
                                        () => setShowQualitySubmenu(false),
                                        100
                                    );
                                }}
                                style={{
                                    top: qualityMenuItemRef.current
                                        ? qualityMenuItemRef.current.offsetTop -
                                          10
                                        : 0,
                                }}
                            >
                                {qualities.map((q) => (
                                    <MenuItem
                                        key={q}
                                        className={`vjs-configuration-submenu-item ${
                                            selectedQuality === q
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onSelect={() => handleQualitySelect(q)}
                                    >
                                        {q}
                                    </MenuItem>
                                ))}
                            </div>
                        )}
                    </MenuList>
                )}
            </Menu>
        </div>
    );
}

ConfigurationMenu.propTypes = {
    player: PropTypes.object.isRequired,
    playbackRates: PropTypes.arrayOf(PropTypes.number).isRequired,
    qualities: PropTypes.arrayOf(PropTypes.string).isRequired,
    translations: PropTypes.object,
};

export default ConfigurationMenu;
