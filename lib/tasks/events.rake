# E.g.:
# bundle exec rake events:create

namespace :events do
  desc 'create example events'
  task :create => :environment do |t, args|
    I18n.locale = :de
    puts "Creating example events…"

    example_events.each do |event|
      Event.create(
        event_type_id: event[:event_type_id],
        eventable_id: event[:eventable_id],
        eventable_type: 'Person',
        start_date: event[:start_date],
        end_date: event[:end_date],
        display_date: event[:display_date]
      )
    end
  end

  def example_events
    [
      {
        event_type_id: 1,
        eventable_id: 22,
        start_date: Date.new(1979, 7, 13),
        end_date: Date.new(1979, 7, 13)
      },
      {
        event_type_id: 1,
        eventable_id: 37,
        start_date: Date.new(1951, 7, 9),
        end_date: Date.new(1951, 7, 9)
      },
      {
        event_type_id: 1,
        eventable_id: 23,
        start_date: Date.new(1969, 3, 1),
        end_date: Date.new(1969, 3, 1)
      },
      {
        event_type_id: 1,
        eventable_id: 25,
        start_date: Date.new(1934, 8, 26),
        end_date: Date.new(1934, 8, 26)
      },
      {
        event_type_id: 1,
        eventable_id: 128,
        start_date: Date.new(1873, 1, 16),
        end_date: Date.new(1873, 1, 16)
      },
      {
        event_type_id: 2,
        eventable_id: 22,
        start_date: Date.new(2000, 4, 1),
        end_date: Date.new(2005, 7, 30)
      },
      {
        event_type_id: 2,
        eventable_id: 37,
        start_date: Date.new(1975, 4, 1),
        end_date: Date.new(1980, 9, 30)
      },
      {
        event_type_id: 2,
        eventable_id: 23,
        start_date: Date.new(1990, 10, 1),
        end_date: Date.new(1998, 3, 31),
        display_date: 'von 1990 bis 1998'
      },
      {
        event_type_id: 2,
        eventable_id: 25,
        start_date: Date.new(1955, 10, 1),
        end_date: Date.new(1959, 9, 30),
        display_date: '1955–1959'
      },
      {
        event_type_id: 2,
        eventable_id: 25,
        start_date: Date.new(1965, 10, 1),
        end_date: Date.new(1969, 9, 30),
        display_date: '1965–1969'
      },
    ]
  end
end
