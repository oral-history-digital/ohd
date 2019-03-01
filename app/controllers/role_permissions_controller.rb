class RolePermissionsController < ApplicationController

  def create
    authorize RolePermission
    @role_permission = RolePermission.create role_permission_params
    @role_permission.role.touch 

    respond_to do |format|
      format.json do
        render json: data_json(@role_permission.role, msg: 'processed')
      end
    end
  end

  #def update
    #@role_permission = RolePermission.find params[:id]
    #authorize @role_permission
    #@role_permission.update_attributes role_permission_params
    #clear_cache @role_permission.role

    #respond_to do |format|
      #format.json do
        #render json: data_json(@role_permission.role, msg: 'processed')
      #end
    #end
  #end

  #def index
    #respond_to do |format|
      #format.json do
        #json = Rails.cache.fetch "#{Project.project_id}-role_permissions-visible-for-#{current_user.id}-#{RolePermission.maximum(:updated_at)}" do
          #{
            #data: policy_scope(RolePermission).inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            #data_type: 'role_permissions'
          #}
        #end
        #render json: json
      #end
    #end
  #end

  def destroy 
    @role_permission = RolePermission.find(params[:id])
    authorize @role_permission
    role = @role_permission.role
    @role_permission.destroy
    role.touch 

    respond_to do |format|
      format.json do
        render json: data_json(role, msg: 'processed')
      end
    end
  end

  private

  def role_permission_params
    params.require(:role_permission).
      permit(
        :role_id,
        :permission_id
    )
  end
end
