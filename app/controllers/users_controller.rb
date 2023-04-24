class UsersController < ApplicationController

  skip_before_action :authenticate_user!, only: [:current, :check_email]
  skip_after_action :verify_authorized, only: [:current, :check_email]
  skip_after_action :verify_policy_scoped, only: [:current, :check_email]

  def current
    respond_to do |format|
      format.html { render 'react/app' }
      format.json do
        render json: {
          id: 'current',
          data_type: 'users',
          data: current_user && ::UserSerializer.new(current_user)
        }
      end
    end
  end

  def update
    authorize(current_user)
    current_user.update user_params
    # FIXME: we have to update duplicated data here
    current_user.update user_params
    respond_to do |format|
      format.html {}
      format.json do
        render json: current_user && {
          id: 'current',
          data_type: 'users',
          data: ::UserSerializer.new(current_user)
        } || {}
      end
    end
  end

  def check_email
    email = params[:email]
    user = User.where(email: email).first

    msg = nil
    email_taken = false

    if user
      email_taken = true
      msg = 'login'

      if !user.confirmed?
        msg = 'account_confirmation_missing'
        # re-send the activation instructions
        user.resend_confirmation_instructions
      elsif current_project
        project_access = user.user_projects.where(project: current_project).first
        if project_access
          msg = project_access.workflow_state
        else
          msg = 'login_and_request_project_access'
        end
      end
    end

    translated_msg = msg && I18n.backend.translate(
      params[:locale],
      "modules.registration.messages.#{msg}",
      email: email,
      project: current_project ? current_project.name : 'Oral-History.Digital'
    )

    respond_to do |format|
      format.json do
        render json: {
          msg: translated_msg,
          email_taken: email_taken
        }
      end
    end
  end
  
  def index
    page = params[:page] || 1
    users = policy_scope(User).
      #where(search_params).
      where("first_name LIKE ? OR last_name LIKE ? OR email LIKE ?", "%#{params[:q]}%", "%#{params[:q]}%", "%#{params[:q]}%").
      where(workflow_state: params[:workflow_state] || (current_project.is_ohd? ? 'confirmed' : 'account_confirmed')).
      order("last_name ASC").
      paginate(page: page, per_page: 25)

    total_pages = users.total_pages
    users = users.includes(:user_projects).
      inject({}){|mem, s| mem[s.id] = UserSerializer.new(s); mem}

    update_initial_redux_state(users)
    extra_params = search_params.update(page: page).inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")

    respond_to do |format|
      format.html { render 'react/app' }
      format.json do |format|
        render json: {
          data: users,
            data_type: 'users',
            extra_params: extra_params,
            page: params[:page],
            result_pages_count: total_pages
          }
      end
      format.csv do
        response.headers['Pragma'] = 'no-cache'
        response.headers['Cache-Control'] = 'no-cache, must-revalidate'
        response.headers['Content-Type'] = 'text/comma-separated-values'
        fields = %w(appellation first_name last_name email job_description organization country street zipcode city created_at)
        csv = [fields.map{|f| translate_field_or_value(f) }.join("\t")]
        users.each do |r|
          r_csv = []
          fields.each do |f|
            r_csv << translate_field_or_value(f, r.send(f.to_sym) || '').gsub(/[,;]+/,'')
          end
          csv << r_csv.join("\t")
        end
        send_data(csv.join("\n"),
                  { :filename => "Nutzer-#{search_params.keys.map{|k| translate_field_or_value(k, search_params[k])}.join("_")}-#{Time.now.strftime('%d.%m.%Y')}.csv",
                    :disposition => 'attachment',
                    :type => 'text/comma-separated-values' })
      end
    end
  end

  def initial_user_redux_state
    initial_redux_state.update(
      user: initial_redux_state[:user].update(
        login: @login,
        display_name: @display_name,
        registration_status: @registration_status,
        active: @active
      )
    )
  end
  helper_method :initial_user_redux_state

  private

  def update_initial_redux_state(users)
    initial_redux_state.update(
      data: initial_redux_state[:data].update(
        users: users
      )
    )
  end

  def user_params
    params.require(:user).permit(
      :appellation,
      :first_name,
      :last_name,
      :email,
      :gender,
      :job_description,
      :research_intentions,
      :comments,
      :organization,
      :homepage,
      :street,
      :zipcode,
      :city,
      :state,
      :country,
      :receive_newsletter,
      :tos_agreement,
      :priv_agreement,
      :default_locale,
      :workflow_state,
    )
  end

  def search_params
    permitted = params.permit(
      :first_name,
      :last_name,
      :email,
      :default_locale,
      'user_projects.workflow_state'
    ).to_h.select{|k,v| !(v.blank?) }
    permitted['user_projects.workflow_state'] = 'account_confirmed' unless permitted['user_projects.workflow_state']
    permitted.delete('user_projects.workflow_state') if permitted['user_projects.workflow_state'] == 'all'
    permitted
  end

end
