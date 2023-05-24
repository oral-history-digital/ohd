class UserProjectSerializer < ApplicationSerializer
  attributes :id,
    :project_id,
    :user_id,
    :workflow_state,
    :workflow_states,
    :mail_text,
    :receive_newsletter,
    :appellation,
    :first_name,
    :last_name,
    :street,
    :zipcode,
    :city,
    :country,
    :job_description,
    :research_intentions,
    :specification,
    :organization,
    :activated_at,
    :processed_at,
    :terminated_at,
    :updated_at,
    :created_at

  def activated_at
    object.activated_at && object.activated_at.strftime("%d.%m.%Y")
  end

  def created_at
    object.created_at.to_f * 1000
  end

  def updated_at
    object.updated_at && object.updated_at.strftime('%d.%m.%Y')
  end

  def processed_at
    object.processed_at && object.processed_at.strftime('%d.%m.%Y')
  end

  def terminated_at
    object.terminated_at && object.terminated_at.strftime('%d.%m.%Y')
  end

  [
    :appellation,
    :first_name,
    :last_name,
    :street,
    :zipcode,
    :city,
    :country,
    :job_description,
    :research_intentions,
    :specification,
    :organization,
  ].each do |attr|
    define_method(attr) do
      object.user.send(attr)
    end
  end
end
