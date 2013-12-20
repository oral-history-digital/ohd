class Admin::ImportsController < Admin::BaseController

  show.response do |wants|
    wants.html do
      render :partial => 'import', :object => object
    end
    wants.js do
      render :partial => 'import', :layout => false, :object => object
    end
  end

  def for_interview
    @interview = Interview.find_by_archive_id(params['archive_id'], :include => [ :imports, :translations ])
    respond_to do |format|
      format.html do
        render :partial => 'for_interview', :object => @interview
      end
      format.js do
        render :partial => 'for_interview', :layout => false, :object => @interview
      end
    end
  end

  private

  def collection
    @interviews = ActiveRecord::Base.connection.select_all("SELECT archive_id, first_name, other_first_names, last_name, name_affix, researched, still_image_file_name, importable_id, time, imports.created_at FROM interviews INNER JOIN interview_translations ON interviews.id = interview_translations.interview_id AND interview_translations.locale = 'de' LEFT JOIN imports ON imports.id = (SELECT imports.id FROM imports WHERE imports.importable_id = interviews.id AND imports.importable_type = 'Interview' ORDER BY time DESC LIMIT 0,1)")
  end

end
