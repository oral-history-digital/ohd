class CatalogController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def index
    respond_to do |format|
      format.html do
        render template: '/react/app'
      end
    end
  end

  def stats
    respond_to do |format|
      format.json do
        num_institutions = Institution.count
        num_projects = Project.shared.count
        num_collections = Collection.count
        num_interviews = Interview.where(workflow_state: ['public', 'restricted']).count

        render json: {
          num_institutions: num_institutions,
          num_projects: num_projects,
          num_collections: num_collections,
          num_interviews: num_interviews
        }
      end
    end
  end

  def institution
    respond_to do |format|
      format.html do
        render template: '/react/app'
      end
    end
  end

  def archive
    respond_to do |format|
      format.html do
        render template: '/react/app'
      end
    end
  end

  def collection
    respond_to do |format|
      format.html do
        render template: '/react/app'
      end
      format.json do
        collection = Collection.find(params[:id])
        data_gatherer = CollectionDataGatherer.new(collection)

        render json: data_gatherer.perform
      end
    end
  end
end
