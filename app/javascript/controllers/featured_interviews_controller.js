import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container"]

  connect() {
    this.loadFeaturedInterviews()
  }

  async loadFeaturedInterviews() {
    try {
      const response = await fetch('/random_featured_interviews.json')
      const data = await response.json()
      
      this.renderInterviews(data.interviews)
    } catch (error) {
      console.error('Failed to load featured interviews:', error)
    }
  }

  renderInterviews(interviews) {
    if (!interviews || interviews.length === 0) {
      this.containerTarget.innerHTML = '<p>No featured interviews available</p>'
      return
    }

    const interviewsHtml = interviews.map(interview => `
      <div class="interview-card">
        <h3><a href="/interviews/${interview.archive_id}">${interview.title}</a></h3>
        <p class="interview-description">${interview.description || ''}</p>
        <div class="interview-meta">
          <span class="duration">${interview.duration || ''}</span>
          <span class="date">${interview.interview_date || ''}</span>
        </div>
      </div>
    `).join('')

    this.containerTarget.innerHTML = interviewsHtml
  }
}