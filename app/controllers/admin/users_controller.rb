class Admin::UsersController < Admin::BaseController

  after_action :verify_policy_scoped, only: [:index, :admin]
  after_action :verify_authorized, except: [:index, :admin]

  def show
    @user = User.find(params[:id])
    authorize @user
    respond_to do |format|
      format.html 
      format.js 
    end
  end

  def update
    @user = User.find(params[:id])
    authorize @user
    @user.update_attributes(user_params)

    respond_to do |format|
      format.html do
        redirect_to edit_admin_user_registration_path(object.user_registration_id)
      end
      format.js
    end
  end

  def admin
    conditionals = []
    condition_args = []
    %w(first_name last_name login).each do |param|
      filter = params[param]
      unless filter.blank?
        conditionals << "#{param == 'login' ? 'user_accounts.' : 'users.'}#{param} LIKE ?"
        condition_args << (filter + '%')
      end
    end
    conditions = [conditionals.join(' OR ')] + condition_args
    @users = policy_scope(User).joins(:user_account, :user_registration).
                  where("user_registrations.workflow_state": 'registered').
                  where(conditions)


    respond_to do |format|
      format.html 
    end
  end

  def flag
    @user = User.find(params[:id])
    authorize @user
    @user.admin = params['admin']
    @user.save

    respond_to do |format|
      format.html do
        if request.referer.blank?
          render :nothing => true
        else
          redirect_to request.referer
        end
      end
      format.js
    end
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :appellation, :street, :zipcity, :country, :job_description, :email, :organization, :homepage)
  end


end
