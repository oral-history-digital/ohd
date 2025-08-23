import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["results", "count", "spinner", "list", "pagination", "filters", "resultsHeader"]

  connect() {
    this.loadInitialResults()
  }

  async loadInitialResults() {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('fulltext') || Object.keys(Object.fromEntries(searchParams)).length > 0) {
      await this.performSearch(searchParams)
    }
  }

  async updateResults(event) {
    // Called after form submission via turbo
    const form = event.target
    const formData = new FormData(form)
    const searchParams = new URLSearchParams(formData)
    
    await this.performSearch(searchParams)
  }

  async performSearch(searchParams) {
    this.showSpinner()
    
    try {
      // Add JSON format to get API response
      searchParams.set('format', 'json')
      
      const response = await fetch(`/searches/archive?${searchParams.toString()}`)
      const data = await response.json()
      
      this.renderResults(data)
    } catch (error) {
      console.error('Search failed:', error)
      this.showError('Search failed. Please try again.')
    } finally {
      this.hideSpinner()
    }
  }

  renderResults(data) {
    this.countTarget.textContent = data.results_count || 0
    
    if (data.interviews && data.interviews.length > 0) {
      const resultsHtml = data.interviews.map(interview => this.renderInterview(interview)).join('')
      this.listTarget.innerHTML = resultsHtml
      
      this.renderPagination(data)
    } else {
      this.listTarget.innerHTML = '<div class="no-results"><p>No interviews found</p></div>'
      this.paginationTarget.innerHTML = ''
    }
  }

  renderInterview(interview) {
    return `
      <div class="interview-result">
        <h3 class="interview-title">
          <a href="/interviews/${interview.archive_id}">${interview.title || interview.archive_id}</a>
        </h3>
        <div class="interview-meta">
          <span class="interview-date">${interview.interview_date || ''}</span>
          <span class="interview-duration">${interview.duration || ''}</span>
        </div>
        <div class="interview-description">
          ${interview.description || ''}
        </div>
      </div>
    `
  }

  renderPagination(data) {
    if (data.result_pages_count > 1) {
      // Simple pagination - can be enhanced
      const currentPage = data.page || 1
      const totalPages = data.result_pages_count
      
      let paginationHtml = '<div class="pagination">'
      
      if (currentPage > 1) {
        paginationHtml += `<a href="?page=${currentPage - 1}" class="page-link">Previous</a>`
      }
      
      paginationHtml += `<span class="current-page">Page ${currentPage} of ${totalPages}</span>`
      
      if (currentPage < totalPages) {
        paginationHtml += `<a href="?page=${currentPage + 1}" class="page-link">Next</a>`
      }
      
      paginationHtml += '</div>'
      this.paginationTarget.innerHTML = paginationHtml
    } else {
      this.paginationTarget.innerHTML = ''
    }
  }

  showSpinner() {
    this.spinnerTarget.style.display = 'block'
    this.listTarget.style.opacity = '0.5'
  }

  hideSpinner() {
    this.spinnerTarget.style.display = 'none'
    this.listTarget.style.opacity = '1'
  }

  showError(message) {
    this.listTarget.innerHTML = `<div class="error-message"><p>${message}</p></div>`
  }
}