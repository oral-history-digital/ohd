class HomeController < BaseController

  skip_before_action :check_user_authentication!

  def map_tutorial
    render layout: false
  end

  def archive
  end

end
