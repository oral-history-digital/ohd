class CatalogController < ApplicationController
  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def index
    respond_to do |format|
      format.html do
        render template: '/react/app.html'
      end
    end
  end

  def institution
    respond_to do |format|
      format.html do
        render template: '/react/app.html'
      end
    end
  end

  def archive
    respond_to do |format|
      format.html do
        render template: '/react/app.html'
      end
    end
  end

  def collection
    respond_to do |format|
      format.html do
        render template: '/react/app.html'
      end
    end
  end
end
