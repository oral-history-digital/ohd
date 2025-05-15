import { createRoot } from 'react-dom/client';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import videojs from 'video.js';

// Import the necessary Video.js components
const Button = videojs.getComponent('Button');

// Create custom forward button class
class CustomForwardButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-custom-skip-forward');
    this.controlText('Forward ' + options.step + ' seconds');
  }

  handleClick() {
    const now = this.player_.currentTime();
    const step = this.options_.step || 5;
    this.player_.currentTime(now + step);
  }

  createEl() {
    const el = super.createEl();
    
    // Replace the inner content with our custom React icon
    const iconContainer = el.querySelector('.vjs-icon-placeholder') || el;
    if (iconContainer) {
      createRoot(iconContainer).render(
        <FaStepForward style={{ fontSize: '.8rem' }} />
      );
    }
    
    return el;
  }
}

// Create custom backward button class
class CustomBackwardButton extends Button {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-custom-skip-backward');
    this.controlText('Backward ' + options.step + ' seconds');
  }

  handleClick() {
    const now = this.player_.currentTime();
    const step = this.options_.step || 5;
    this.player_.currentTime(Math.max(0, now - step));
  }

  createEl() {
    const el = super.createEl();
    
    // Replace the inner content with our custom React icon
    const iconContainer = el.querySelector('.vjs-icon-placeholder') || el;
    if (iconContainer) {
      createRoot(iconContainer).render(
        <FaStepBackward style={{ fontSize: '.8rem' }} />
      );
    }
    
    return el;
  }
}

// Register the custom components
videojs.registerComponent('CustomForwardButton', CustomForwardButton);
videojs.registerComponent('CustomBackwardButton', CustomBackwardButton);

// Plugin function
function customSkipButtonsPlugin() {
  const player = this;
  
  // Run on ready to make sure the control bar exists
  player.ready(() => {
    const controlBar = player.controlBar;
    
    // Remove the default skip buttons if they exist
    const existingForward = controlBar.getChild('skipForward');
    const existingBackward = controlBar.getChild('skipBackward');
    
    if (existingForward) {
      controlBar.removeChild('skipForward');
    }
    
    if (existingBackward) {
      controlBar.removeChild('skipBackward');
    }
    
    // Get the step values from options
    const forwardStep = player.options_.controlBar?.skipButtons?.forward || 5;
    const backwardStep = player.options_.controlBar?.skipButtons?.backward || 5;
    
    // Add our custom buttons in the same positions
    const playToggleIndex = controlBar.children_.indexOf(controlBar.getChild('playToggle'));
    
    if (playToggleIndex !== -1) {
      controlBar.addChild('CustomForwardButton', {
        step: forwardStep
      }, playToggleIndex + 1);
      
      controlBar.addChild('CustomBackwardButton', {
        step: backwardStep
      }, playToggleIndex);
    } else {
      // Fallback if playToggle doesn't exist
      controlBar.addChild('CustomBackwardButton', { step: backwardStep });
      controlBar.addChild('CustomForwardButton', { step: forwardStep });
    }
  });
}

// Register the plugin
videojs.registerPlugin('customSkipButtonsPlugin', customSkipButtonsPlugin);

export default customSkipButtonsPlugin;