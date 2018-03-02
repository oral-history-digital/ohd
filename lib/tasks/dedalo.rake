namespace :dedalo do
  desc 'validate periods'
  task :validate_periods => :environment do
      # check periods
      if !(RegistryEntry.where(entry_dedalo_code: "hierarchy1_246").first.entry_code == "periods")
        RegistryEntry.where(entry_dedalo_code: "hierarchy1_246").first.update_attribute :entry_code, 'periods'
        p "updated entry_code for RegistryEntry.where(entry_dedalo_code: 'hierarchy1_246)' to 'periods'"
      else
        p "entry_code for RegistryEntry.where(entry_dedalo_code: 'hierarchy1_246)' is already set to 'periods'"
      end
  end

  desc 'list segments with empty translations'
  task :empty_segments => :environment do
    p "list of all #{Interview.all.count} interviews:"
    p Interview.all.map(&:archive_id)
    p "list of all empty segments by archive_id and timecode:"
    Interview.all.each{|i| p "#{i.archive_id} => #{i.segments.where(translation: '').map(&:timecode)}".gsub(/\"/,"")}
  end

  desc 'list all places of birth of all interviewees'
  task :birth_places => :environment do
    p "list of all places of birth of all interviewees:"
    Interview.all.each{|i| p "#{i.archive_id} => #{!i.interviewees.nil? && !i.interviewees.first.nil? && !i.interviewees.first.place_of_birth.nil? ? i.interviewees.first.place_of_birth.localized_hash : "place of birth missing"}".gsub(/\"/,"")}
  end

  desc 'list all places of all interviews'
  task :interview_places => :environment do
    p "list of all places of all interviews:"
    Interview.all.each{|i| p "#{i.archive_id} => #{!i.place_of_interview.nil? ? i.place_of_interview.localized_hash : "place of interview  missing" }".gsub(/\"/,"")}
  end

  desc 'check all'
  task :check => ['dedalo:empty_segments', 'dedalo:birth_places', 'dedalo:interview_places'] do
    puts 'check complete.'
  end

end



