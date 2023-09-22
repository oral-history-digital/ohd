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
    :pre_register_location,
    :pre_access_location,
    :default_locale,
    :tos_agreement,
    :activated_at,
    :processed_at,
    :terminated_at,
    :updated_at,
    :created_at

  def activated_at
    object.activated_at && object.activated_at.strftime("%d.%m.%Y")
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
    :pre_register_location,
  ].each do |attr|
    define_method(attr) do
      object.user.send(attr)
    end
  end

  def default_locale
    object.user.default_locale
  end
end
