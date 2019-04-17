class ReadBulkTextsFileJob < ApplicationJob
  include IsoHelpers
  queue_as :default

  def perform(file_path, receiver)
    zip_content = []
    Zip::File.open(file_path) do |zip_file|
      zip_file.each do |entry|
        if entry.name.split('.').last == 'xlsx' 
          #File.open(File.join(Rails.root, 'tmp', entry.name), 'wb') {|f| entry.get_input_stream.read) }
          #zip_content['xlsx'] = File.join(Rails.root, 'tmp', entry.name)
        else
          text_file_name = File.join(Rails.root, 'tmp', entry.name)
          zip_content << text_file_name
          File.open(text_file_name, 'wb') {|f| f.write entry.get_input_stream.read }
        end 
      end
    end

    zip_content.each do |text_file_name|
      name_parts = File.basename(text_file_name, File.extname(text_file_name)).split('_')
      archive_id = name_parts.first
      kind = name_parts[1] # protocoll or biographie (bg)
      locale = ISO_639.find(name_parts.last).send(Project.alpha)

      data = File.read text_file_name
      text = Yomu.read :text, data

      interview = Interview.find_by_archive_id(archive_id)
      if interview
        case kind
        when 'protocoll'
          interview.update_attributes observations: text, locale: locale
        when 'bg'
          # do not append biographical entries again and again
          if interview.interviewees.first.biographical_entries.empty?
            text = text.sub(/Kurzbiografie.*\n+/, '')
            text_parts = text.split(/\n+/)
            is_text_with_dates = check_for_dates(text_parts)
            date = nil
            while !text_parts.empty? && !text_parts.first.match(/Zwangsarbeit 1939-1945\S*/)
              date = text_parts.shift if is_text_with_dates
              entry = text_parts.shift
              BiographicalEntry.create(person_id: interview.interviewees.first.id, locale: locale, text: entry, start_date: date)
            end
          end
        else
          logger.info "*** DON'T KNOW WHAT TO DO WITH #{File.basename(text_file_name)}!!!"
        end
      end

      File.delete(text_file_name) if File.exist?(text_file_name)
    rescue StandardError => e
      logger.info("*** #{archive_id}: #{e.message}!!!")
    end
    File.delete(file_path) if File.exist?(file_path)
    AdminMailer.with(receiver: receiver, type: 'read_protokolls', file: file_path).finished_job.deliver_now
  end

  def check_for_dates(text_parts)
    # collect the uneven numbered parts of text (1st, 2nd, 3rd, ...)
    # as they might be dates
    possible_dates = 0.step(text_parts.size - 1, 2).map { |i| text_parts[i] }

    # if these  possible date strings are short they might really be dates
    possible_dates.select{|d| d.length > 25}.empty?
  end
end
