import { useState, useEffect, useRef } from 'react';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import { BsGearFill } from 'react-icons/bs';
import { MdSlowMotionVideo } from 'react-icons/md';
import { LuSettings2 } from 'react-icons/lu';
import { IoIosArrowForward } from 'react-icons/io';

function ConfigurationMenu({ player, playbackRates, qualities }) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showRateSubmenu, setShowRateSubmenu] = useState(false);
    const [showQualitySubmenu, setShowQualitySubmenu] = useState(false);
    const [selectedRate, setSelectedRate] = useState(player.playbackRate());
    const [selectedQuality, setSelectedQuality] = useState(
        qualities?.find((q) => q === 'Default') || qualities?.[0] || null
    );

    const menuTimeout = useRef(null);
    const rateSubmenuTimeout = useRef(null);
    const qualitySubmenuTimeout = useRef(null);

    const handlePlaybackRate = (rate) => {
        player.playbackRate(rate);
        setSelectedRate(rate);
        setShowRateSubmenu(false);
        setIsMenuVisible(false); // Cierra el menú principal al seleccionar una opción
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
            <Menu>
                <MenuButton className="vjs-configuration-menu-button">
                    <BsGearFill className="vjs-configuration-menu-icon" />
                </MenuButton>

                {isMenuVisible && (
                    <MenuList className="vjs-configuration-menu">
                        <MenuItem
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

export default ConfigurationMenu;
