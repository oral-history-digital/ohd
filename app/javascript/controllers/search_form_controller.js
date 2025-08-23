import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
    return ["input"]
  }

  connect() {
    this.debounceTimer = null
  }

  submit(event) {
    // Allow normal form submission
    clearTimeout(this.debounceTimer)
  }

  debounceSubmit() {
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.element.requestSubmit()
    }, 500) // 500ms delay
  }

  disconnect() {
    clearTimeout(this.debounceTimer)
  }
}