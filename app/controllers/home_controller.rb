class HomeController < BaseController

  layout 'responsive'

  skip_before_action :authenticate_user_account!

  def map_tutorial
    render layout: false
  end

  def archive
    respond_to do |format|
      format.html do
        render :template => '/react/app.html'
      end
      format.json do

        locales = Project.available_locales.reject{|i| i == 'alias'}
        home_content = {}
        locales.each do |i|
          I18n.locale = i
          template = "/home/home.#{i}.html+#{Project.name.to_s}"
          home_content[i] = render_to_string(template: template, layout: false)
        end
        render json: {home_content: home_content,
                      external_links: Project.external_links}

      end
    end


    #render json: {interviews: render_to_string(template: '/interviews/index.html', layout: false)}

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
