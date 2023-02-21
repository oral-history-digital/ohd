class EventSerializer < ApplicationSerializer
  attributes :id,
    :event_type_id,
    :eventable_type,
    :eventable_id,
    :start_date,
    :end_date,
    :display_date,
    :created_at,
    :updated_at
end
