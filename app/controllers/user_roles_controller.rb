class UserRolesController < ApplicationController

  def create
    authorize UserRole
    @user_role = UserRole.create user_role_params
    respond_to do |format|
      format.json do
        render json: data_json(@user_role, 'processed')
      end
    end
  end

  def update
    @user_role = UserRole.find params[:id]
    authorize @user_role
    @user_role.update_attributes user_role_params
    respond_to do |format|
      format.json do
        render json: data_json(@user_role, 'processed')
      end
    end
  end

  def index
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{Project.project_id}-user_roles-visible-for-#{current_user.id}-#{UserRole.maximum(:updated_at)}" do
          {
            data: policy_scope(UserRole).inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'user_roles'
          }
        end
        render json: json
      end
    end
  end

  def destroy 
    @user_role = UserRole.find(params[:id])
    authorize @user_role
    @user_role.destroy

    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def user_role_params
    params.require(:user_role).
      permit(
        :user_id,
        :role_id
    )
  end
end
