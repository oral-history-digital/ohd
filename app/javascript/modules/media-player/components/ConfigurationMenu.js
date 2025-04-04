// ConfigurationMenu.js

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";

import { BsGearFill } from "react-icons/bs";
import { MdSlowMotionVideo } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";

/**
 * ConfigurationMenu (React)
 * --------------------------
 * Renders a configuration menu for playback speed and quality selection.
 */
function ConfigurationMenu({ player, playbackRates, qualities }) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedRate, setSelectedRate] = useState(player.playbackRate());
    const [selectedQuality, setSelectedQuality] = useState(
        qualities?.find((q) => q === "Default") || qualities?.[0] || null
    );
    const menuTimeout = useRef(null);

    const handlePlaybackRate = (rate) => {
        player.playbackRate(rate);
        setSelectedRate(rate);
        setIsMenuVisible(false);
    };

    const handleQualitySelect = (qualityLabel) => {
        player.trigger("qualitySelected", { quality: qualityLabel });
        setSelectedQuality(qualityLabel);
        setIsMenuVisible(false);
    };

    const showMenu = () => {
        clearTimeout(menuTimeout.current);
        setIsMenuVisible(true);
    };

    const hideMenu = () => {
        menuTimeout.current = setTimeout(() => {
            setIsMenuVisible(false);
        }, 100);
    };

    useEffect(() => {
        return () => {
            clearTimeout(menuTimeout.current);
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
                        <MenuItem className="vjs-configuration-menu-item main-container disabled">
                            <div className="menu-item-title-container">
                                <MdSlowMotionVideo className="rate-icon" />
                                <span>Rate</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>
                        {playbackRates.map((rate) => (
                            <MenuItem
                                key={rate}
                                className={`vjs-configuration-menu-item ${selectedRate === rate ? "selected" : ""
                                    }`}
                                onSelect={() => handlePlaybackRate(rate)}
                            >
                                {rate}x
                            </MenuItem>
                        ))}

                        <hr className="vjs-configuration-menu-divider" />

                        <MenuItem className="vjs-configuration-menu-item main-container disabled">
                            <div className="menu-item-title-container">
                                <LuSettings2 />
                                <span>Quality</span>
                            </div>
                            <IoIosArrowForward />
                        </MenuItem>
                        {qualities.map((q) => (
                            <MenuItem
                                key={q}
                                className={`vjs-configuration-menu-item ${selectedQuality === q ? "selected" : ""
                                    }`}
                                onSelect={() => handleQualitySelect(q)}
                            >
                                {q}
                            </MenuItem>
                        ))}
                    </MenuList>
                )}
            </Menu>
        </div>
    );
}

ConfigurationMenu.propTypes = {
    player: PropTypes.object.isRequired,
    playbackRates: PropTypes.arrayOf(PropTypes.number),
    qualities: PropTypes.arrayOf(PropTypes.string),
};

export default ConfigurationMenu;
