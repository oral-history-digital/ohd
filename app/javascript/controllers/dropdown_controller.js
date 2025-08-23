import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]

  toggle() {
    this.menuTarget.classList.toggle("show")
  }

  disconnect() {
    this.menuTarget.classList.remove("show")
  }
}