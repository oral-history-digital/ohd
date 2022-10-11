class EventTypeSerializer < ActiveModel::Serializer
  attributes :id, :code, :name, :project_id
end
