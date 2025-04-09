import { createRoot } from 'react-dom/client';
import videojs from 'video.js';
import { MdOutlineFitScreen } from "react-icons/md";

const VjsButton = videojs.getComponent('Button');

class ToggleSizeButton extends VjsButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-toggle-size-button');
    this.options_ = options;
    this.isOriginalSize = false; // Estado para rastrear el tamaño actual
  }

  handleClick() {
    const layoutElement = document.querySelector('.Layout'); // Contenedor principal
    const mediaPlayerElement = document.querySelector('.MediaPlayer'); // Contenedor del reproductor

    if (!layoutElement || !mediaPlayerElement) return;

    if (layoutElement.classList.contains('is-sticky')) {
      // Si está en modo sticky, cambia al tamaño original
      layoutElement.classList.remove('is-sticky');
      mediaPlayerElement.style.height = ''; // Restablece el tamaño original
    } else {
      // Si no está en modo sticky, cambia al tamaño reducido
      layoutElement.classList.add('is-sticky');
      mediaPlayerElement.style.height = 'var(--media-player-height-sticky)'; // Tamaño reducido
    }

    this.isOriginalSize = !this.isOriginalSize; // Alterna el estado
  }

  createEl() {
    const el = super.createEl('button', {
      className: 'vjs-control vjs-button vjs-toggle-size-button',
    });

    // Renderiza el ícono dinámico usando React
    const root = createRoot(el);
    root.render(
      <span className="vjs-icon-placeholder">
        <MdOutlineFitScreen style={{ fontSize: '1.2rem' }} />
      </span>
    );

    return el;
  }
}

videojs.registerComponent('ToggleSizeButton', ToggleSizeButton);

function toggleSizePlugin(options = {}) {
  if (this.toggleSizePluginInitialized) return;
  this.toggleSizePluginInitialized = true;
  this.getChild('controlBar').addChild('ToggleSizeButton', options, 7);
}

videojs.registerPlugin('toggleSizePlugin', toggleSizePlugin);

export default toggleSizePlugin;