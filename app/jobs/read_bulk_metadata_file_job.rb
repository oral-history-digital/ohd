class ReadBulkMetadataFileJob < ApplicationJob
  queue_as :default

  def perform(opts)
    MetadataImport.new(opts[:file_path], opts[:project], opts[:locale]).process
    Sunspot.index opts[:project].interviews
    opts[:project].touch
  end

end
