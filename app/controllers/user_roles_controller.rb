class UserRolesController < ApplicationController

  def create
    authorize UserRole
    @user_role = UserRole.create user_role_params
    clear_cache @user_role.user.user_registration

    respond_to do |format|
      format.json do
        render json: data_json(@user_role.user.user_registration, msg: 'processed')
      end
    end
  end

  def destroy 
    @user_role = UserRole.find(params[:id])
    authorize @user_role
    user_registration = @user_role.user.user_registration
    @user_role.destroy
    clear_cache user_registration

    respond_to do |format|
      format.json { 
        render json: data_json(user_registration, msg: 'processed')
      }
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
