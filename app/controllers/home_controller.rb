# Controller for "static" pages in app/view/home
class HomeController < BaseController

  NO_LAYOUT = %w(map_tutorial)

  STATIC_PAGES = (Dir.entries(File.join(Rails.root, 'app/views/home')) - ['.','..']).map{|f| f[/^[^\.]*/]}.compact

  skip_before_filter :check_user_authentication!

  def show
    @page_action = (
      if params[:page_id].blank?
        # Display the home page by default.
        'archive'
      else
        # Reverse lookup the page action for the given pretty URL
        (I18n.backend.send(:translations)[I18n.locale][:page_urls].index(params[:page_id]) || '')
      end
    ).to_s

    if @page_action.blank?
      # Redirect to the home page if the page id is not valid.
      return redirect_to :page_id => I18n.t('archive', :scope => :page_urls)
    end

    without_layout = NO_LAYOUT.include?(@page_action)
    if STATIC_PAGES.include?(@page_action)
      if without_layout
        render_localized :action => @page_action, :layout => false
      else
        render_localized :action => @page_action
      end
    else
      raise ActionController::UnknownAction
    end
  end

end
