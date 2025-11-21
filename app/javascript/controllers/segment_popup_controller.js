import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  showPopup(event) {
    event.preventDefault();
    this.closeAllFrames();
    const url = event.currentTarget.getAttribute('href');
    const frameId = event.currentTarget.dataset.turboFrame;
    const frame = document.getElementById(frameId);
    frame?.classList.add("is-open");
    if (url && frameId) {
      Turbo.visit(url, { frame: frameId });
    }
  }

  closeAllFrames() {
    document.querySelectorAll(".SegmentPopupFrame.is-open").forEach(frame => {
      frame.innerHTML = "";
      frame.classList.remove("is-open");
    });
  }

  togglePopup(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const frameId = link.dataset.turboFrame;
    const frame = document.getElementById(frameId);

    // Toggle: close if already open
    if (frame && frame.classList.contains("is-open")) {
      frame.innerHTML = '';
      frame.classList.remove("is-open");
      return;
    }

    this.showPopup(event);
  }

}
