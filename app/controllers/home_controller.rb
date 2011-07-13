# Controller for "static" pages in app/view/home
class HomeController < BaseController

  STATIC_PAGES = (Dir.entries(File.join(RAILS_ROOT, 'app/views/home')) - ['.','..']).map{|f| f[/^[^\.]*/]}.compact

  skip_before_filter :authenticate_user!

  def show
    @page_action = I18n.t(params[:page_id], :scope => 'page_paths')
    if STATIC_PAGES.include?(@page_action)
      render_localized :action => @page_action
    else
      raise ActionController::UnknownAction
    end
  end
  
end