class StylesheetsController < ApplicationController

  skip_before_action :authenticate_user_account!, only: [:show, :doi_contents]
  skip_after_action :verify_authorized, only: [:show, :doi_contents, :metadata]
  skip_after_action :verify_policy_scoped, only: [:show, :doi_contents, :metadata]

  def show
    respond_to do |format|
      format.css do
        css = Rails.cache.fetch "#{current_project.cache_key_prefix}-stylesheets-#{current_project.updated_at}" do
          pre = render_to_string(template: 'stylesheets/master.scss.erb', layout: false)
          Sass.compile(pre)
        end
        render body: css, content_type: 'text/css'
      end
    end
  end
end
