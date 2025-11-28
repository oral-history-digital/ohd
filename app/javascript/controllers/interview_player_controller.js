import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get targets() {
    return ["video", "audio", "controls", "transcript", "index", "time"]
  }

  connect() {
    this.mediaElement = this.hasVideoTarget ? this.videoTarget.querySelector('video') : 
                       this.hasAudioTarget ? this.audioTarget.querySelector('audio') : null
                       
    if (this.mediaElement) {
      this.setupMediaEvents()
      this.loadTranscript()
      this.loadIndex()
    }
  }

  setupMediaEvents() {
    this.mediaElement.addEventListener('timeupdate', () => {
      this.updateTimeDisplay()
    })
    
    this.mediaElement.addEventListener('loadedmetadata', () => {
      console.log('Media loaded')
    })
  }

  togglePlay() {
    if (!this.mediaElement) return
    
    if (this.mediaElement.paused) {
      this.mediaElement.play()
    } else {
      this.mediaElement.pause()
    }
  }

  updateTimeDisplay() {
    if (this.hasTimeTarget && this.mediaElement) {
      const time = this.mediaElement.currentTime
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      this.timeTarget.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }

  async loadTranscript() {
    if (!this.hasTranscriptTarget) return
    
    try {
      // Get interview ID from URL or data attribute
      const interviewId = this.getInterviewId()
      if (!interviewId) return
      
      const response = await fetch(`/interviews/${interviewId}/segments.json`)
      const data = await response.json()
      
      this.renderTranscript(data.segments || [])
    } catch (error) {
      console.error('Failed to load transcript:', error)
      this.transcriptTarget.innerHTML = '<p>Failed to load transcript</p>'
    }
  }

  async loadIndex() {
    if (!this.hasIndexTarget) return
    
    try {
      const interviewId = this.getInterviewId()
      if (!interviewId) return
      
      const response = await fetch(`/interviews/${interviewId}/registry_references.json`)
      const data = await response.json()
      
      this.renderIndex(data.registry_references || [])
    } catch (error) {
      console.error('Failed to load index:', error)
      this.indexTarget.innerHTML = '<p>Failed to load index</p>'
    }
  }

  renderTranscript(segments) {
    if (segments.length === 0) {
      this.transcriptTarget.innerHTML = '<p>No transcript available</p>'
      return
    }

    const transcriptHtml = segments.map(segment => `
      <div class="segment" data-time="${segment.time}">
        <span class="segment-time">${this.formatTime(segment.time)}</span>
        <span class="segment-text">${segment.text}</span>
      </div>
    `).join('')

    this.transcriptTarget.innerHTML = transcriptHtml
  }

  renderIndex(entries) {
    if (entries.length === 0) {
      this.indexTarget.innerHTML = '<p>No index entries available</p>'
      return
    }

    const indexHtml = entries.map(entry => `
      <div class="index-entry">
        <span class="entry-name">${entry.name}</span>
        <span class="entry-time">${this.formatTime(entry.time)}</span>
      </div>
    `).join('')

    this.indexTarget.innerHTML = indexHtml
  }

  getInterviewId() {
    // Extract interview ID from URL
    const path = window.location.pathname
    const matches = path.match(/\/interviews\/([^\/]+)/)
    return matches ? matches[1] : null
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}