import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  close() {
    this.element.remove()
  }

  // Close modal when clicking outside
  clickOutside(event) {
    if (event.target === this.element) {
      this.close()
    }
  }

  // Close modal on escape key
  keydown(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }

  connect() {
    document.addEventListener("keydown", this.keydown.bind(this))
  }

  disconnect() {
    document.removeEventListener("keydown", this.keydown.bind(this))
  }
}