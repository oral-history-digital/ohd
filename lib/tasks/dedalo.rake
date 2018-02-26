namespace :dedalo do
  desc 'validate periods'
  task :validate_periods => :environment do
      # check periods
      if !RegistryEntry.where(entry_dedalo_code: "hierarchy1_246").first.entry_code == "periods"
        RegistryEntry.where(entry_dedalo_code: "hierarchy1_246").first.update_attribute :entry_code, 'periods'
        p "updated entry_code for RegistryEntry.where(entry_dedalo_code: 'hierarchy1_246)' to 'periods'"
      else
        p "entry_code for RegistryEntry.where(entry_dedalo_code: 'hierarchy1_246)' is already set to 'periods'"
      end
  end

  desc 'list segments with empty translations'
  task :list_empty_segments => :environment do
    p "list of all #{Interview.all.count} interviews:"
    p Interview.all.map(&:archive_id)
    p "list of all empty segments by archive_id and timecode:"
    Interview.all.each_with_object({}){|i, o| p "#{i.archive_id} => #{i.segments.where(translation: '').map(&:timecode)}".gsub(/\"/,"")}
  end
end



