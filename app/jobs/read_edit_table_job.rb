class ReadEditTableJob < ApplicationJob
  queue_as :default

  def perform(opts)
    EditTableImport.new(
      opts[:interview],
      opts[:file_path],
      opts[:locale],
      opts[:only_references],
    ).process

    File.delete(opts[:file_path]) if File.exist?(opts[:file_path])
    opts[:interview].touch
  end

end
