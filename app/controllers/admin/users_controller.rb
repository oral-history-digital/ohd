class Admin::UsersController < Admin::BaseController

  def show
    @user = User.find(params[:id])
    respond_to do |format|
      format.html 
      format.js 
    end
  end

  def update
    User.find(params[:id]).update_attributes(user_params)
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
    @users = User.joins(:user_account, :user_registration).
                  where("user_registrations.workflow_state": 'registered').
                  where(admin: true).
                  where(conditions).
                  order("admin ASC, users.last_name ASC")
    respond_to do |format|
      format.html 
    end
  end

  def flag
    @object = User.find(params[:id])
    @object.admin = params['admin']
    @object.save
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
