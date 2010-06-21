class UserRegistrationsController < BaseController

  skip_before_filter :authenticate_user_account!, :only => [:create, :new]

  actions :create, :new, :index, :update, :edit

  prepend_before_filter :require_admin_user, :only => [:index, :edit, :update]

  edit do
    wants.js do
      render :update do |page|
        page.insert_html :after, 'user-registration-overlay', :partial => 'user_registration', :object => @object
        page.visual_effect :appear, 'user-registration-overlay', :to => 0.6, :duration => 0.4
        page.visual_effect :appear, 'lightbox-container'
      end
    end
  end
  
  private

  def require_admin_user
    #TODO: check if admin
    redirect_to '/'
  end  

end
