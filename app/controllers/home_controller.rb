# Controller for "static" pages in app/view/home
class HomeController < BaseController

  STATIC_PAGES = (Dir.entries(File.join(RAILS_ROOT, 'app/views/home')) - ['.','..']).map{|f| f[/^[^\.]*/]}.compact

  def show
    if STATIC_PAGES.include?(params[:page])
      render :template => "/home/#{params[:page]}.#{@locale}.html.erb"
    else
      raise ActionController::UnknownAction
    end
  end
  
end