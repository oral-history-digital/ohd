class Admin::ImportsController < Admin::BaseController


  private

  def collection
    # @interviews = Interview.find(:all, :joins => "LEFT JOIN imports ON imports.id = (SELECT imports.id FROM imports WHERE imports.importable_id = interviews.id AND imports.importable_type = 'Interview' ORDER BY time DESC LIMIT 1)")
    @interviews = ActiveRecord::Base.connection.select_all("SELECT archive_id, full_title, researched, still_image_file_name, importable_id, time FROM interviews LEFT JOIN imports ON imports.id = (SELECT imports.id FROM imports WHERE imports.importable_id = interviews.id AND imports.importable_type = 'Interview' ORDER BY time DESC LIMIT 1)")
  end

end