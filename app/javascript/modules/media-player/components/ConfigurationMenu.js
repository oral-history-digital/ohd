// ConfigurationMenu.js
"use client"
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";

import { BsGearFill } from "react-icons/bs";
import { MdSlowMotionVideo } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";

/**
 * ConfigurationMenu
 * -----------------
 * Renders a configuration menu for playback rate and quality selection.
 * Submenus for "Rate" and "Quality" open on hover.
 */
function ConfigurationMenu({ player, playbackRates, qualities }) {
	// Local states for menu and submenu visibility and selections
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [showRateSubmenu, setShowRateSubmenu] = useState(false);
	const [showQualitySubmenu, setShowQualitySubmenu] = useState(false);
	const [selectedRate, setSelectedRate] = useState(player.playbackRate());
	const [selectedQuality, setSelectedQuality] = useState(
		qualities?.find((q) => q === "Default") || qualities?.[0] || null
	);

	// Timer to hide main menu after mouse leaves
	const menuTimeout = useRef(null);

	// Handle playback rate selection
	const handlePlaybackRate = (rate) => {
		player.playbackRate(rate);
		setSelectedRate(rate);
		setShowRateSubmenu(false);
	};

	// Handle quality selection
	const handleQualitySelect = (qualityLabel) => {
		player.trigger("qualitySelected", { quality: qualityLabel });
		setSelectedQuality(qualityLabel);
		setShowQualitySubmenu(false);
	};

	// Show/hide the main menu on mouse enter/leave
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
						{/* Rate Header: Opens rate submenu on hover */}
						<MenuItem
							className="vjs-configuration-menu-item main-container"
							onMouseEnter={() => setShowRateSubmenu(true)}
							onMouseLeave={() => setShowRateSubmenu(false)}
						>
							<div className="menu-item-title-container">
								<MdSlowMotionVideo className="rate-icon" />
								<span>Rate</span>
							</div>
							<IoIosArrowForward />
						</MenuItem>

						{/* Horizontal submenu for Rate options */}
						{showRateSubmenu && (
							<div
								className="vjs-configuration-submenu horizontal-menu"
								onMouseEnter={() => setShowRateSubmenu(true)} // Mantiene el submenú abierto
								onMouseLeave={() => setShowRateSubmenu(false)} // Cierra el submenú al salir
							>
								{playbackRates.map((rate) => (
									<button
										key={rate}
										type="button"
										className={`vjs-configuration-submenu-item ${selectedRate === rate ? "selected" : ""
											}`}
										onClick={() => handlePlaybackRate(rate)}
									>
										{rate}x
									</button>
								))}
							</div>
						)}

						<hr className="vjs-configuration-menu-divider" />

						{/* Quality Header: Opens quality submenu on hover */}
						<MenuItem
							className="vjs-configuration-menu-item main-container"
							onMouseEnter={() => setShowQualitySubmenu(true)}
							onMouseLeave={() => setShowQualitySubmenu(false)}
						>
							<div className="menu-item-title-container">
								<LuSettings2 className="quality-icon" /> {/* Ícono de calidad */}
								<span>Quality</span>
							</div>
							<IoIosArrowForward />
						</MenuItem>

						{/* Horizontal submenu for Quality options */}
						{showQualitySubmenu && (
							<div
								className="vjs-configuration-submenu horizontal-menu"
								onMouseEnter={() => setShowQualitySubmenu(true)} // Mantiene el submenú abierto
								onMouseLeave={() => setShowQualitySubmenu(false)} // Cierra el submenú al salir
							>
								{qualities.map((q) => (
									<button
										key={q}
										type="button"
										className={`vjs-configuration-submenu-item ${selectedQuality === q ? "selected" : ""
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
