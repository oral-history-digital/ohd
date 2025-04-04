"use client"
import React from "react"
import videojs from "video.js"
import PropTypes from "prop-types"
import { createRoot } from "react-dom/client"

import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button"
import "@reach/menu-button/styles.css"

import { BsGearFill } from "react-icons/bs"
import { MdSlowMotionVideo } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { IoIosArrowForward } from "react-icons/io";

const VjsButton = videojs.getComponent("Button")

/**
 * ConfigurationControl
 * --------------------
 * Extiende un Button de Video.js y monta MyConfigMenu.
 */
function MyConfigMenu({ player, playbackRates, qualities }) {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [selectedRate, setSelectedRate] = React.useState(player.playbackRate()); // Velocidad seleccionada
  const [selectedQuality, setSelectedQuality] = React.useState(
    qualities?.find((q) => q === "Default") || qualities?.[0] || null // Calidad seleccionada
  );

  const menuTimeout = React.useRef(null);

  // Cuando seleccionen una velocidad:
  const handlePlaybackRate = (rate) => {
    player.playbackRate(rate);
    setSelectedRate(rate); // Marca la velocidad seleccionada
    setIsMenuVisible(false);
  };

  // Cuando seleccionen una calidad:
  const handleQualitySelect = (qualityLabel) => {
    player.trigger("qualitySelected", { quality: qualityLabel });
    setSelectedQuality(qualityLabel); // Marca la calidad seleccionada
    setIsMenuVisible(false);
  };

  const showMenu = () => {
    if (menuTimeout.current) {
      clearTimeout(menuTimeout.current); // Cancela el temporizador si existe
    }
    setIsMenuVisible(true);
  };
  
  const hideMenu = () => {
    menuTimeout.current = setTimeout(() => {
      setIsMenuVisible(false);
    }, 100); // Retraso de 100ms
  };

  // Limpia el temporizador al desmontar el componente
  React.useEffect(() => {
    return () => {
      if (menuTimeout.current) {
        clearTimeout(menuTimeout.current);
      }
    };
  }, []);

  return (
    <div
      className="vjs-configuration-menu-container"
      onMouseEnter={showMenu} // Show menu on hover
      onMouseLeave={hideMenu} // Hide menu on mouse leave
    >
      {/* Botón del menú */}
      <Menu>
        <MenuButton className="vjs-configuration-menu-button">
          <BsGearFill className="vjs-configuration-menu-icon" />
        </MenuButton>

        {/* Lista del menú */}
        {isMenuVisible && (
          <MenuList className="vjs-configuration-menu">
            {/* Velocidades */}
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

            {/* Calidades */}
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

MyConfigMenu.propTypes = {
  player: PropTypes.object.isRequired,
  playbackRates: PropTypes.arrayOf(PropTypes.number),
  qualities: PropTypes.arrayOf(PropTypes.string),
};
// No necesitamos defaultProps aquí, los valores por defecto se manejarán en el plugin

/**
 * ConfigurationControl
 * --------------------
 * Extiende un Button de Video.js y monta MyConfigMenu.
 */
class ConfigurationControl extends VjsButton {
  constructor(player, options) {
    super(player, options)
    this.addClass("vjs-configuration-plugin")

    // Guardamos las opciones (playbackRates, qualities, etc.) para usarlas en createEl
    this.options_ = options
  }

  createEl() {
    // Creamos el elemento base
    const el = super.createEl("div", {
      className: "vjs-configuration-plugin-container",
    })

    // Contenedor para React
    this.reactRoot = document.createElement("div")
    el.appendChild(this.reactRoot)

    // Montamos el menú con React, pasando props:
    this.root = createRoot(this.reactRoot)
    this.root.render(
      <MyConfigMenu
        player={this.player_}
        playbackRates={this.options_.playbackRates || this.player_.options_.playbackRates || [0.5, 1, 1.5, 2]}
        qualities={this.options_.qualities || ["Default"]}
      />,
    )

    return el
  }

  dispose() {
    if (this.root) {
      this.root.unmount()
    }
    super.dispose()
  }
}

/**
 * Plugin
 * ------
 * Registra "ConfigurationControl" y lo añade a la controlBar.
 */
function configurationMenuPlugin(pluginOptions = {}) {
  if (this.configurationMenuPluginInitialized) {
    return
  }
  this.configurationMenuPluginInitialized = true

  // Registramos el componente si aún no existe
  if (!videojs.getComponent("ConfigurationControl")) {
    videojs.registerComponent("ConfigurationControl", ConfigurationControl)
  }

  // Si no se proporcionan playbackRates en las opciones del plugin,
  // intentamos obtenerlos de las opciones del player
  if (!pluginOptions.playbackRates && this.options_.playbackRates) {
    pluginOptions.playbackRates = this.options_.playbackRates
  }

  // Insertamos el botón en la barra
  // - pluginOptions se pasa como "options" al componente
  // - Tercer parámetro = índice (posición en la barra)
  this.getChild("controlBar").addChild("ConfigurationControl", pluginOptions, 6)
}

// Registramos el plugin en Video.js
videojs.registerPlugin("configurationMenuPlugin", configurationMenuPlugin)

export default configurationMenuPlugin


