class ReadProtocolsFileJob < ApplicationJob
  include IsoHelpers
  queue_as :default

  def perform(file_path)
    zip_content = []
    Zip::File.open(file_path) do |zip_file|
      zip_file.each do |entry|
        if entry.name.split('.').last == 'xlsx' 
          #File.open(File.join(Rails.root, 'tmp', entry.name), 'wb') {|f| entry.get_input_stream.read) }
          #zip_content['xlsx'] = File.join(Rails.root, 'tmp', entry.name)
        else
          rtf = File.join(Rails.root, 'tmp', entry.name)
          zip_content << rtf
          File.open(rtf, 'wb') {|f| f.write entry.get_input_stream.read }
        end 
      end
    end

    zip_content.each do |rtf|
      name_parts = rtf.sub('.rtf', '').split('/').last.split('_')

      yomu = Yomu.new rtf
      text = yomu.text

      interview = Interview.find_by_archive_id(name_parts.first)
      locale = ISO_639.find(name_parts.last).send(Project.alpha)
      translation = interview.translations.find_or_create_by(locale: locale)
      translation.update_attribute :observations, txt

      File.delete(rtf) if File.exist?(rtf)
    end
    File.delete(file_path) if File.exist?(file_path)
    # TODO: send mail to someone informing about finished interview
  end

end
