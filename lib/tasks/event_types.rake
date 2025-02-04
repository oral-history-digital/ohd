# E.g.:
# bundle exec rake event_types:create

namespace :event_types do
  desc 'create default event_types'
  task :create => :environment do |t, args|
    Project.all.each do |project|
      puts "Creating default event types for project #{project.shortname}…"

      default_event_types.each do |key, translation_key|
        # Create event type.
        event_type = project.event_types.find_by_code(key)
        if event_type.blank?
          event_type = EventType.create(code: key, project: project)
          puts "Creating event type #{key}."
        else
          puts "Skipping event type #{key}."
        end

        # Create translations.
        project.available_locales.each do |locale|
          I18n.locale = locale.to_sym
          event_type.name = TranslationValue.for(translation_key, locale)
          event_type.save
        end
        end

        event_type.save
      end
    end

    I18n.locale = :de
  end

  def default_event_types
    {
      date_of_birth: 'event_types.date_of_birth',
    }
  end
end
