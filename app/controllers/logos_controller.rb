class LogosController < ApplicationController
  require 'open-uri'

  def create
    @uploaded_file = UploadedFile.new(logo_params)
    authorize_logo(@uploaded_file, :create?)
    @uploaded_file.save!

    respond @uploaded_file
  end

  def update
    @uploaded_file = UploadedFile.find(params[:id])
    authorize_logo(@uploaded_file, :update?)
    candidate = @uploaded_file.dup
    candidate.assign_attributes(logo_params.except(:file))
    if @uploaded_file.ref_type == 'Collection' &&
        [candidate.ref_type, candidate.ref_id, candidate.type] !=
          [@uploaded_file.ref_type, @uploaded_file.ref_id, @uploaded_file.type]
      raise Pundit::NotAuthorizedError
    end
    authorize_logo(candidate, :update?)
    @uploaded_file.update!(logo_params)
    respond @uploaded_file
  end

  def destroy 
    @uploaded_file = UploadedFile.find(params[:id])
    authorize_logo(@uploaded_file, :destroy?)
    @uploaded_file.destroy

    return respond(@uploaded_file) if @uploaded_file.ref_type == 'Collection'

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def index
    policy_scope(UploadedFile)
    respond_to do |format|
      format.html { render 'react/app' }
    end
  end

  private

  # Authorizes collection branding through its owner in the request project.
  # Other upload owners retain their existing UploadedFile permissions.
  # @param uploaded_file [UploadedFile] Existing or proposed upload
  # @param action [Symbol] Requested upload policy action
  # @return [void]
  def authorize_logo(uploaded_file, action)
    if uploaded_file.ref_type == 'Collection'
      raise Pundit::NotAuthorizedError unless uploaded_file.type == 'Logo'

      collection = current_project.collections.find(uploaded_file.ref_id)
      authorize collection, :update?
    else
      authorize(action == :create? ? UploadedFile : uploaded_file, action)
    end
  end

  def respond uploaded_file
    uploaded_file.ref.touch
    if uploaded_file.ref_type == 'Collection'
      collection = uploaded_file.ref
      return render json: {
        data_type: 'projects', id: collection.project_id,
        nested_data_type: 'collections', nested_id: collection.id,
        data: CollectionSerializer.new(collection.reload).as_json
      }
    end

    respond_to do |format|
      format.json do
        render json: {
          data_type: uploaded_file.ref_type.underscore.pluralize,
          id: uploaded_file.ref_id,
          nested_data_type: uploaded_file.type.underscore.pluralize,
          nested_id: uploaded_file.id,
          data: ::UploadedFileSerializer.new(uploaded_file).as_json
        }
      end
    end
  end

  def logo_params
    params.require(:logo).permit(
      :id, 
      :type,
      :ref_id, 
      :ref_type,
      :locale,
      :file,
      :href,
      :title
    )
  end

end
