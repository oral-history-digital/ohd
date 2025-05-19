import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { BsGearFill } from 'react-icons/bs';
import { IoIosArrowForward } from 'react-icons/io';
import { LuSettings2 } from 'react-icons/lu';
import { MdSlowMotionVideo } from 'react-icons/md';

function ConfigurationMenu({ player, playbackRates, qualities }) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showRateSubmenu, setShowRateSubmenu] = useState(false);
    const [showQualitySubmenu, setShowQualitySubmenu] = useState(false);
    const [selectedRate, setSelectedRate] = useState(player.playbackRate());
    const [selectedQuality, setSelectedQuality] = useState(() => {
        if (player && typeof player.currentSources === 'function') {
            const sources = player.currentSources();
            if (sources && sources.length > 0) {
                const defaultSource =
                    sources.find((source) => source.selected) || sources[0];
                return (
                    defaultSource.label ||
                    (defaultSource.height
                        ? `${defaultSource.height}p`
                        : qualities[0])
                );
            }
        }
        return qualities[0] || null;
    });

    // Video element reference
    const videoElementRef = useRef(null);

    useEffect(() => {
        if (!player) return;

        // Get the actual HTML video element
        videoElementRef.current = player.el().querySelector('video');

        const handleRateChange = () => {
            setSelectedRate(player.playbackRate());
        };

        const handleQualitySelected = (event, { quality }) => {
            setSelectedQuality(quality);
        };

        player.on('ratechange', handleRateChange);
        player.on('qualitySelected', handleQualitySelected);

        return () => {
            player.off('ratechange', handleRateChange);
            player.off('qualitySelected', handleQualitySelected);
        };
    }, [player]);

    const rateMenuItemRef = useRef(null);
    const qualityMenuItemRef = useRef(null);

    const menuTimeout = useRef(null);
    const rateSubmenuTimeout = useRef(null);
    const qualitySubmenuTimeout = useRef(null);

    const handlePlaybackRate = (rate) => {
        player.playbackRate(rate);
        setSelectedRate(rate);
        setShowRateSubmenu(false);
        setIsMenuVisible(false);
    };

    const handleQualitySelect = (qualityLabel) => {
        player.trigger('qualitySelected', { quality: qualityLabel });
        setSelectedQuality(qualityLabel);
        setShowQualitySubmenu(false);
        setIsMenuVisible(false);
    };

    const showMenu = () => {
        clearTimeout(menuTimeout.current);
        setIsMenuVisible(true);
    };

    const hideMenu = () => {
        menuTimeout.current = setTimeout(() => {
            setIsMenuVisible(false);
            setShowRateSubmenu(false);
            setShowQualitySubmenu(false);
        }, 100);
    };

    const showRateSub = () => {
        clearTimeout(rateSubmenuTimeout.current);
        setShowRateSubmenu(true);
    };

    const hideRateSub = () => {
        rateSubmenuTimeout.current = setTimeout(() => {
            setShowRateSubmenu(false);
        }, 100);
    };

    const showQualitySub = () => {
        clearTimeout(qualitySubmenuTimeout.current);
        setShowQualitySubmenu(true);
    };

    const hideQualitySub = () => {
        qualitySubmenuTimeout.current = setTimeout(() => {
            setShowQualitySubmenu(false);
        }, 100);
    };

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

    useEffect(() => {
        return () => {
            clearTimeout(menuTimeout.current);
            clearTimeout(rateSubmenuTimeout.current);
            clearTimeout(qualitySubmenuTimeout.current);
        };
    }, []);

    return (
        <div
            className="vjs-configuration-menu-container"
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
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
                        <MenuItem
                            ref={rateMenuItemRef}
                            className="vjs-configuration-menu-item main-container"
                            onMouseEnter={showRateSub}
                            onMouseLeave={hideRateSub}
                        >
                            <div className="menu-item-title-container">
                                <MdSlowMotionVideo className="rate-icon" />
                                <span>Rate</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>

                        {showRateSubmenu && (
                            <div
                                className="vjs-configuration-submenu horizontal-menu"
                                onMouseEnter={showRateSub}
                                onMouseLeave={hideRateSub}
                                style={{
                                    top: rateMenuItemRef.current
                                        ? rateMenuItemRef.current.offsetTop - 5
                                        : 0,
                                }}
                            >
                                {playbackRates.map((rate) => (
                                    <button
                                        key={rate}
                                        type="button"
                                        className={`vjs-configuration-submenu-item ${
                                            selectedRate === rate
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() => handlePlaybackRate(rate)}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}

                        <hr className="vjs-configuration-menu-divider" />

                        <MenuItem
                            ref={qualityMenuItemRef}
                            className="vjs-configuration-menu-item main-container"
                            onMouseEnter={showQualitySub}
                            onMouseLeave={hideQualitySub}
                        >
                            <div className="menu-item-title-container">
                                <LuSettings2 className="quality-icon" />
                                <span>Quality</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>

                        {showQualitySubmenu && (
                            <div
                                className="vjs-configuration-submenu horizontal-menu"
                                onMouseEnter={showQualitySub}
                                onMouseLeave={hideQualitySub}
                                style={{
                                    top: qualityMenuItemRef.current
                                        ? qualityMenuItemRef.current.offsetTop -
                                          5
                                        : 0,
                                }}
                            >
                                {qualities.map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        className={`vjs-configuration-submenu-item ${
                                            selectedQuality === q
                                                ? 'selected'
                                                : ''
                                        }`}
                                        onClick={() => handleQualitySelect(q)}
                                    >
                                        {q}
                                    </button>
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
};

export default ConfigurationMenu;
