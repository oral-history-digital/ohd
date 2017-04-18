class HomeController < BaseController

  skip_before_action :check_user_authentication!

  def map_tutorial
    render layout: false
  end

  def archive
  end

  def faq_archive_contents
  end

  def faq_index
  end

  def faq_searching
  end

  def faq_technical
  end

  def map_tutorial
  end

end
