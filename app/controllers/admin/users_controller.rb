class Admin::UsersController < Admin::BaseController

  actions :show, :update

  show.response do |wants|
    wants.html do
    end
    wants.js do
      html = render_to_string :template => '/admin/users/show.html', :layout => false
      # render :text => html, :layout => false

      render :update do |page|
        page.replace_html 'modal_window', :text => html, :layout => false
        page.visual_effect :appear, 'modal_window'
        page.visual_effect :appear, 'shades'
      end
    end
  end

end
