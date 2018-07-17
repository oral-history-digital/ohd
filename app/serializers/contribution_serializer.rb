class ContributionSerializer < ActiveModel::Serializer
  attributes :id, :contribution_type, :person_id, :interview_id
end
