class SlimInterviewSerializer < ActiveModel::Serializer
  attributes :id, :archive_id, :project_id, :collection_id, :anonymous_title
end
