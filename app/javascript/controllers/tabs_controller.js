import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
    return ["link", "pane"]
  }

  switch(event) {
    const targetTab = event.currentTarget.dataset.tab
    
    // Remove active class from all links and panes
    this.linkTargets.forEach(link => link.classList.remove('active'))
    this.paneTargets.forEach(pane => pane.classList.remove('active'))
    
    // Add active class to clicked link
    event.currentTarget.classList.add('active')
    
    // Show corresponding pane
    const targetPane = this.element.querySelector(`[data-tab="${targetTab}"]`)
    if (targetPane) {
      targetPane.classList.add('active')
    }
  }
}