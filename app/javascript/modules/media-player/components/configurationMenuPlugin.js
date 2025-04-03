"use client"

import videojs from "video.js"
import PropTypes from "prop-types"
import { createRoot } from "react-dom/client"

// Librerías de @reach/menu-button
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button"
import "@reach/menu-button/styles.css"

// Icono de engranaje, por ejemplo
import { BsGearFill } from "react-icons/bs"

// Tomamos el "Button" de Video.js
const VjsButton = videojs.getComponent("Button")

/**
 * MyConfigMenu
 * ------------
 * Componente React que usa @reach/menu-button para renderizar el menú.
 * - Recibe:
 *     player (objeto Video.js)
 *     playbackRates (array de números)
 *     qualities (array de strings)
 */
function MyConfigMenu({ player, playbackRates, qualities }) {
  // Cuando seleccionen una velocidad:
  const handlePlaybackRate = (rate) => {
    player.playbackRate(rate)
  }

  // Cuando seleccionen una calidad:
  const handleQualitySelect = (qualityLabel) => {
    // Podrías llamar directamente a un plugin de calidad, o disparar un evento
    // para que el resto de tu app se entere y cambie la calidad.
    player.trigger("qualitySelected", { quality: qualityLabel })
  }

  return (
    <Menu>
      <MenuButton>
        <BsGearFill style={{ marginRight: "4px", fontSize: '1.5em' }} />
      </MenuButton>
      <MenuList>
        {/* Velocidades */}
        <MenuItem disabled>Velocidades:</MenuItem>
        {playbackRates.map((rate) => (
          <MenuItem key={rate} onSelect={() => handlePlaybackRate(rate)}>
            {rate}x
          </MenuItem>
        ))}

        <hr />

        {/* Calidades */}
        <MenuItem disabled>Calidades:</MenuItem>
        {qualities.map((q) => (
          <MenuItem key={q} onSelect={() => handleQualitySelect(q)}>
            {q}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

MyConfigMenu.propTypes = {
  player: PropTypes.object.isRequired,
  playbackRates: PropTypes.arrayOf(PropTypes.number),
  qualities: PropTypes.arrayOf(PropTypes.string),
}

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
        qualities={this.options_.qualities || ["480p", "720p", "1080p"]}
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

