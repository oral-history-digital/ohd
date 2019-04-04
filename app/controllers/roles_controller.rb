class RolesController < ApplicationController

  def create
    authorize Role
    @role = Role.create role_params
    respond_to do |format|
      format.json do
        render json: data_json(@role, msg: 'processed')
      end
    end
  end

  def update
    @role = Role.find params[:id]
    authorize @role
    @role.update_attributes role_params
    respond_to do |format|
      format.json do
        render json: data_json(@role, msg: 'processed')
      end
    end
  end

  def index
    page = params[:page] || 1
    roles = policy_scope(Role).where(search_params).order("created_at DESC").paginate page: page
    extra_params = search_params.update(page: page).inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")

    respond_to do |format|
      format.html { render :template => '/react/app.html' }
      format.json do
        json = #Rails.cache.fetch "#{Project.cache_key_prefix}-roles-visible-for-#{current_user_account.id}-#{extra_params}-#{Role.maximum(:updated_at)}" do
          {
            data: roles.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'roles',
            extra_params: extra_params,
            page: params[:page], 
            result_pages_count: roles.total_pages
          }
        #end
        render json: json
      end
    end
  end

  def destroy 
    @role = Role.find(params[:id])
    authorize @role
    @role.destroy

    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def role_params
    params.require(:role).
      permit(
        :name,
        :desc
    )
  end

  def search_params
    params.permit(:name, :desc).to_h
  end
end
