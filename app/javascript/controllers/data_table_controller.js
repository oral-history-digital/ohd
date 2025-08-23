import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("Data table connected")
  }

  // Handle row selection if needed
  selectRow(event) {
    const row = event.currentTarget.closest('tr')
    row.classList.toggle('selected')
  }

  // Handle sorting if needed  
  sort(event) {
    const column = event.currentTarget
    const table = this.element.querySelector('table')
    // Add sorting logic here if needed
  }
}