class ProjectRemoveFavicon < ApplicationService
  def initialize(project:)
    @project = project
  end

  def perform
    @project.favicon.purge if @project.favicon.attached?
    @project.touch
    @project
  end
end
