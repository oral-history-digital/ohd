class RolePermissionsController < ApplicationController

  def create
    authorize RolePermission
    @role_permission = RolePermission.create role_permission_params
    respond @role_permission.role
  end

  def destroy 
    @role_permission = RolePermission.find(params[:id])
    authorize @role_permission
    role = @role_permission.role
    @role_permission.destroy

    respond role
  end

  private

  def respond role
    respond_to do |format|
      format.json do
        render json: {
          nested_id: role.id,
          data: cache_single(role),
          nested_data_type: "roles",
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  def role_permission_params
    params.require(:role_permission).
      permit(
        :role_id,
        :permission_id
    )
  end
end
