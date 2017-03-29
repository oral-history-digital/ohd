class Admin::UsersController < Admin::BaseController

  actions :show, :update

  show.response do |wants|
    wants.html do
    end
    wants.js do
      html = render_to_string :template => '/admin/users/show.html', :layout => false
      render :update do |page|
        page.replace_html 'modal_window', :text => html, :layout => false
        page.visual_effect :appear, 'modal_window'
        page.visual_effect :appear, 'shades'
      end
    end
  end

  update.response do |wants|
    wants.html do
      redirect_to edit_admin_user_registration_path(object.user_registration_id)
    end
    wants.js do
      render :update do |page|
        page.visual_effect :fade, 'modal_window'
        page.visual_effect :fade, 'shades'
        page << "window.location.reload(true);"
      end
    end
  end

  def admin
    puts('admin')
    conditionals = ['admin IS TRUE']
    condition_args = []
    %w(first_name last_name login).each do |param|
      filter = params[param]
      unless filter.blank?
        conditionals << "#{param == 'login' ? 'user_accounts.' : 'users.'}#{param} LIKE ?"
        condition_args << (filter + '%')
      end
    end
    joins = "RIGHT JOIN user_accounts ON users.user_account_id = user_accounts.id RIGHT JOIN user_registrations ON users.user_registration_id = user_registrations.id"
    conditions = ["workflow_state = 'registered' AND (" + conditionals.join(' OR ') + ")"] + condition_args
    @users = User.all(:joins => joins, :conditions => conditions, :order => "admin ASC, users.last_name ASC")
    respond_to do |format|
      format.html do
      end
      format.js do
        render :partial => 'user', :collection => @users, :layout => false
      end
    end
  end

  def flag
    @object = User.find(params[:id])
    @object.admin = !params['admin'].blank?
    @object.save
    respond_to do |format|
      format.html do
        if request.referer.blank?
          render :nothing => true
        else
          redirect_to request.referer
        end
      end
      format.js do
        render :update do |page|
          page.replace "admin_#{@object.id}", :partial => 'admin_flag', :object => @object
        end
      end
    end
  end


end
