class UserRolesController < ApplicationController

  def create
    authorize UserRole
    @user_role = UserRole.create user_role_params
    @user_role.user.touch

    respond_to do |format|
      format.json do
        render json: data_json(@user_role.user, msg: 'processed')
      end
    end
  end

  def destroy
    @user_role = UserRole.find(params[:id])
    authorize @user_role
    user = @user_role.user
    @user_role.destroy
    user.touch

    respond_to do |format|
      format.json {
        render json: data_json(user, msg: 'processed')
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
