class ReadBulkTextsFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver, project, locale)
    jobs_logger.info "*** uploading #{file_path} text-files"
    zip_content = []
    Zip::File.open(file_path) do |zip_file|
      zip_file.each do |entry|
        entry_name = entry.name.split('/').last
        if entry_name.split('.').last == 'xlsx' 
          #File.open(File.join(Rails.root, 'tmp', 'files', entry_name), 'wb') {|f| entry.get_input_stream.read) }
          #zip_content['xlsx'] = File.join(Rails.root, 'tmp', 'files', entry_name)
        elsif entry.ftype != :directory
          text_file_name = File.join(Rails.root, 'tmp', 'files', entry_name)
          zip_content << text_file_name
          File.open(text_file_name, 'wb') {|f| f.write entry.get_input_stream.read }
        end 
      end
    end

    zip_content.each do |text_file_name|
      name_parts = File.basename(text_file_name, File.extname(text_file_name)).split('_')
      archive_id = name_parts.first
      kind = name_parts[1] # protocoll or biographie (bg)
      locale = name_parts[2] ? ISO_639.find(name_parts[2]).alpha2 : 'de'

      data = File.read text_file_name
      text = Yomu.read :text, data

      interview = Interview.find_by_archive_id(archive_id)
      if interview
        case kind
        when 'protocoll', 'pk', 'prot'
          interview.update observations: text, locale: locale
        when 'bg'
          text = text.sub(/[^\n]*\(#{archive_id.upcase}\)\n+/, '')
          #
          # split text and remove header/footer if present
          # than join the text again
          #
          text_parts = text.split(/\n+/)
          text = ""
          while !text_parts.empty? && (
              !text_parts.first.match(/Zwangsarbeit 1939-1945\S*/) &&
              !text_parts.first.match(/Forced Labor 1939-1945\S*/) &&
              !text_parts.first.match(/Принудительный труд 1939-1945\S*/) 
          )
            part = text_parts.shift 
            text << "\n\n#{part}"
          end
          bg = BiographicalEntry.find_or_create_by(person_id: interview.interviewees.first.id)
          bg.update(locale: locale, text: text)
          #
          # the following is a more complex trial:
          #
          # do not append biographical entries again and again
          #if interview.interviewees.first.biographical_entries.where(localeempty?
            #text = text.sub(/Kurzbiografie.*\n+/, '')
            #text_parts = text.split(/\n+/)
            #while !text_parts.empty? && !text_parts.first.match(/Zwangsarbeit 1939-1945\S*/)
              #part = text_parts.shift 
              ##
              ## if this (text-) part is short and contains number(s) it is possibly a line containing something like a date
              ## e.g. 'summer 1945'
              ##
              #if part.length < 25 && part =~ /\d+/
                #date = part
                #entry = text_parts.shift
              #else
                #date = nil
                #entry = part
              #end
              #BiographicalEntry.create(person_id: interview.interviewees.first.id, locale: locale, text: entry, start_date: date)
            #end
          #end
        else
          jobs_logger.info "*** DON'T KNOW WHAT TO DO WITH #{File.basename(text_file_name)}!!!"
        end
      end

      File.delete(text_file_name) if File.exist?(text_file_name)
    rescue StandardError => e
      jobs_logger.info("*** #{archive_id}: #{e.message}!!!")
      jobs_logger.info("*** #{archive_id}: #{e.backtrace}!!!")
    end
    File.delete(file_path) if File.exist?(file_path)

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_bulk_texts.processed',
      #file: File.basename(file_path),
    #)

    jobs_logger.info "*** uploaded #{file_path} text-files"
    AdminMailer.with(receiver: receiver, type: 'read_bulk_texts', file: file_path).finished_job.deliver_now
  end

end
