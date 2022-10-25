# E.g.:
# bundle exec rake event_types:create['cd']

namespace :event_types do
  desc 'create default event_types'
  task :create, [:project_shortname] => :environment do |t, args|
    project = Project.where(shortname: args.project_shortname).first
    I18n.locale = project.default_locale
    puts "Creating default event types for project #{project.name}…"

    default_event_types.each do |key, name|
      event_type = EventType.find_by_code(key)
      if event_type.blank?
        EventType.create(code: key, name: name)
        puts "Creating event type #{key}."
      else
        puts "Skipping event type #{key}."
      end
    end
  end

  def default_event_types
    {
      date_of_birth: 'Geburtsdatum',
    }
  end
end
