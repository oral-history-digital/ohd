class RolesController < ApplicationController

  def create
    authorize Role
    @role = Role.create role_params
    respond_to do |format|
      format.json do
        render json: data_json(@role, 'processed')
      end
    end
  end

  def update
    @role = Role.find params[:id]
    authorize @role
    @role.update_attributes role_params
    respond_to do |format|
      format.json do
        render json: data_json(@role, 'processed')
      end
    end
  end

  def index
    roles = policy_scope(Role)
    respond_to do |format|
      format.html { render :template => '/react/app.html' }
      format.json do
        json = Rails.cache.fetch "#{Project.project_id}-roles-visible-for-#{current_user_account.id}-#{Role.maximum(:updated_at)}" do
          {
            data: roles.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'roles'
          }
        end
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
end
