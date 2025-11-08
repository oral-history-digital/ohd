class RolesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def create
    authorize Role
    @role = Role.create role_params
    respond @role
  end

  def update
    @role = Role.find params[:id]
    authorize @role
    @role.update role_params
    respond @role
  end

  def index
    policy_scope(Role)
    @component = 'WrappedRolesContainer'

    respond_to do |format|
      format.html { render :template => '/react/app' }
      format.json do
        json = Rails.cache.fetch "#{current_project.shortname}-roles-visible-for-#{current_user.id}-#{cache_key_params}-#{Role.count}-#{Role.maximum(:updated_at)}" do
          if params[:for_projects]
            data = policy_scope(Role).
              includes(:permissions).
              joins(:translations).
              order("name ASC")
            extra_params = "for_projects_#{current_project.id}"
          else
            page = params[:page] || 1
            data = policy_scope(Role).
              includes(:permissions).
              joins(:translations).
              where(search_params).order("name ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end
          {
            data: data.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            nested_data_type: 'roles',
            data_type: 'projects',
            id: current_project.id,
            extra_params: extra_params,
            page: params[:page], 
            result_pages_count: paginate ? data.total_pages : nil
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

  def role_params
    params.require(:role).
      permit(
        :name,
        :desc,
        :project_id,
        translations_attributes: [:locale, :id, :name]
    )
  end

  def search_params
    params.permit(:name, :desc).to_h.select{|k,v| !v.blank? }
  end
end
