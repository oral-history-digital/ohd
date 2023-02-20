class EventTypeSerializer < ApplicationSerializer
  attributes :id, :code, :name, :project_id, :created_at, :updated_at
end
