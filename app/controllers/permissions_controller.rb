class PermissionsController < ApplicationController

  def create
    authorize Permission
    @permission = Permission.create permission_params
    respond_to do |format|
      format.json do
        render json: data_json(@permission, 'processed')
      end
    end
  end

  def update
    @permission = Permission.find params[:id]
    authorize @permission
    @permission.update_attributes permission_params
    respond_to do |format|
      format.json do
        render json: data_json(@permission, 'processed')
      end
    end
  end

  def index
    permissions = policy_scope(Permission).where(search_params).order("created_at DESC").paginate page: params[:page] || 1
    extra_params = search_params.inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")

    respond_to do |format|
      format.html { render :template => '/react/app.html' }
      format.json do
        json = Rails.cache.fetch "#{Project.project_id}-permissions-visible-for-#{current_user_account.id}-#{extra_params}-#{Permission.maximum(:updated_at)}" do
          {
            data: permissions.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'permissions',
            extra_params: extra_params,
            page: params[:page], 
            result_pages_count: permissions.total_pages
          }
        end
        render json: json
      end
    end
  end

  def destroy 
    @permission = Permission.find(params[:id])
    authorize @permission
    @permission.destroy

    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def permission_params
    params.require(:permission).
      permit(
        :name,
        :desc,
        :controller,
        :action
    )
  end

  def search_params
    params.permit(:name, :desc).to_h
  end
end
