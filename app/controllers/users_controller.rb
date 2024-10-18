class UsersController < ApplicationController

  skip_before_action :authenticate_user!, only: [:confirm_new_email, :current, :check_email]
  skip_before_action :store_user_location!, only: [:confirm_new_email, :check_email]
  skip_before_action :user_by_token, only: [:confirm_new_email, :check_email]
  skip_before_action :check_ohd_session, only: [:confirm_new_email, :check_email]
  skip_after_action :verify_authorized, only: [:confirm_new_email, :current, :check_email, :newsletter_recipients]
  skip_after_action :verify_policy_scoped, only: [:confirm_new_email, :current, :check_email]

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
    user = params[:id] == 'current' ? current_user : User.find(params[:id])
    authorize(user)
    user.update(user_params)

    if params[:user][:workflow_state] == 'remove'
      render json: {id: params[:id], data_type: 'users', data: {id: params[:id], workflow_state: 'removed'}}
    else
      render json: {id: user.id, data_type: 'users', data: ::UserSerializer.new(user)}
    end
  end

  def check_email
    email = params[:email]
    user = User.where(email: email).first

    msg = nil
    registration_error = false
    reset_password_error = false

    if user
      registration_error = true
      msg = 'login'

      if !user.confirmed?
        msg = 'account_confirmation_missing'
        user.resend_confirmation_instructions
        reset_password_error = true
      elsif current_project && !current_project.is_ohd?
        project_access = user.user_projects.where(project: current_project).first
        if project_access
          msg = project_access.workflow_state
        else
          msg = 'login_and_request_project_access'
        end
      end
    else
      msg = 'still_not_registered'
      reset_password_error = true
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
          registration_error: registration_error,
          reset_password_error: reset_password_error
        }
      end
    end
  end
  
  def confirm_new_email
    user = User.find(params[:id])
    if user.confirmation_token == params[:confirmation_token]
      user.confirm
      user.update(login: user.email)
      sign_in(user)
      redirect_to user_url('current')
    else
      raise 'confirmation_token does not fit!!'
    end
  end

  def index
    order = params[:order] || 'last_name'
    if ['processed_at', 'workflow_state'].include? order
      if current_project.is_ohd?
        order = "users.#{order}"
      else
        order = "user_projects.#{order}"
      end
    end
    direction = params[:direction] || 'asc'

    users = policy_scope(User).
      where("first_name LIKE ? OR last_name LIKE ? OR email LIKE ?", "%#{params[:q]}%", "%#{params[:q]}%", "%#{params[:q]}%")

    users = users.where(workflow_state: params[:workflow_state] || 'confirmed') if current_project.is_ohd? && params[:workflow_state] != 'all'
    users = users.joins(:user_projects).where("user_projects.workflow_state = ?", params[:workflow_state] || 'project_access_requested') if !current_project.is_ohd? && params[:workflow_state] != 'all' && params[:workflow_users_for_project].blank?
    users = users.joins(:user_projects).where("user_projects.project_id = ?", params[:project]) if !params[:project].blank?

    users = users.where(default_locale: params[:default_locale]) if (!params[:default_locale].blank? || params[:default_locale] == 'all')
    users = users.joins(:user_roles).where("user_roles.role_id = ?", params[:role]) if !params[:role].blank?

    if !params[:workflow_users_for_project].blank?
      workflowRoleIds = current_project.roles.where(name: %w(Redaktion Qualitätsmanagement Archivmanagement)).map(&:id)
      users = users.joins(:user_roles).where("user_roles.role_id IN (?)", workflowRoleIds)
    end

    users = users.order([order, direction].join(' '))

    if params[:page]
      users = users.paginate(page: params[:page], per_page: 25)
      total_entries = users.total_entries
      total_pages = users.total_pages
    end

    users = users.map{|u| UserSerializer.new(u)}

    respond_to do |format|
      format.html { render 'react/app' }
      format.json do |format|
        render json: {
          data: users,
          data_type: 'users',
          page: params[:page],
          result_pages_count: total_pages,
          total: total_entries
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

  def newsletter_recipients
    users = policy_scope(User).joins(:user_projects).where("user_projects.receive_newsletter = ?", true)

    respond_to do |format|
      format.csv do
        csv = CSV.generate(**CSV_OPTIONS) do |row|
          row << ['E-Mail', 'Datum der Freischaltung']
          users.each do |u|
            row << [u.email, u.confirmed_at.strftime('%d.%m.%Y')]
          end
        end
        send_data(
          csv,
          filename: "E-Mail-Empfaenger-#{current_project.shortname}-#{Time.now.strftime('%d.%m.%Y')}.csv",
          disposition: 'attachment',
          type: 'text/comma-separated-values'
        )
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
      :mail_text,
      :job_description,
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
      :workflow_state,
      'user_projects.workflow_state'
    ).to_h.select{|k,v| !(v.blank?) }
    permitted['user_projects.workflow_state'] = 'project_access_requested' unless permitted['user_projects.workflow_state']
    permitted.delete('user_projects.workflow_state') if permitted['user_projects.workflow_state'] == 'all'
    permitted
  end

end
