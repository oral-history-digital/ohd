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
      format.html
    end
  end

end
