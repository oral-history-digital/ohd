class Admin::ImportsController < Admin::BaseController

  before_action :collection, only: [:index]
  before_action :object, except: [:index]

  def show
    respond_to do |format|
      format.html do
        render :partial => 'import', :object => @object
      end
      format.js
    end
  end

  def for_interview
    @interview = Interview.includes(:imports, :translations).find_by_archive_id(params['archive_id'])
    respond_to do |format|
      format.html do
        render :partial => 'for_interview', :object => @interview
      end
      format.js
    end
  end

  private

  def collection
    @interviews = ActiveRecord::Base.connection.select_all("SELECT archive_id, first_name, last_name, researched, still_image_file_name, importable_id, time, imports.created_at FROM interviews INNER JOIN interview_translations ON interviews.id = interview_translations.interview_id AND interview_translations.locale = 'de' LEFT JOIN imports ON imports.id = (SELECT imports.id FROM imports WHERE imports.importable_id = interviews.id AND imports.importable_type = 'Interview' ORDER BY time DESC LIMIT 0,1)")
    @interviews.map do |interview|
      interview['short_title'] = [interview['first_name'], interview['last_name']].join(' ')
    end
  end

  def object
    @object = Import.where(id: params[:id]).first
  end

end
