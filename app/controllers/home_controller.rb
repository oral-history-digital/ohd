# Controller for "static" pages in app/view/home
class HomeController < BaseController

  STATIC_PAGES = (Dir.entries(File.join(RAILS_ROOT, 'app/views/home')) - ['.','..']).map{|f| f[/^[^\.]*/]}.compact

  skip_before_filter :check_user_authentication!

  def show
    page_label = params[:page_id].blank? ? 'home' : params[:page_id]
    @page_action = I18n.t(page_label, :scope => 'page_paths')
    if STATIC_PAGES.include?(@page_action)
      render_localized :action => @page_action
    else
      raise ActionController::UnknownAction
    end
  end
  
end