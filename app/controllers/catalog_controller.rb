class CatalogController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def index
    @component = 'MainCatalog'
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
        num_interviews = Interview.shared.count

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
    @component = 'InstitutionCatalog'
    respond_to do |format|
      format.html do
        render template: '/react/app'
      end
    end
  end

  def archive
    @component = 'ArchiveCatalog'
    respond_to do |format|
      format.html do
        render template: '/react/app'
      end
    end
  end

  def collection
    @component = 'CollectionCatalog'
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
