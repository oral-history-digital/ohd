namespace :event_types do
  desc 'create default event_types'
  task :create, [:project_initials] => :environment do |t, args|
    project = Project.where(initials: args.project_initials).first

    default_event_types.each do |key, (german_name, english_name)|
      if EventType.exists?(code: key)
        next
      end

      I18n.locale = 'en'
      et = EventType.new(code: key, name: english_name)
      I18n.locale = 'de'
      et.name = german_name
      et.save
    end
  end

  def default_event_types
    {
      date_of_birth: ['Geburtsdatum', 'Date of birth'],
    }
  end
end
