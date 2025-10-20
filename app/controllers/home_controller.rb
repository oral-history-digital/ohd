class HomeController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped
  skip_before_action :set_locale, only: [:overview]

  def map_tutorial
    render layout: false
  end

  def overview
    @projects = Project.all
    respond_to do |format|
      format.html { render layout: 'turbo_application' }
    end
  end
  
  # Individual project home page  
  def show
    respond_to do |format|
      format.html { render layout: 'turbo_application' }
      format.json do
        # Keep JSON API for any remaining JavaScript needs
        render json: { project: current_project }
      end
    end
  end

end
