class WebauthnCredentialSerializer < ActiveModel::Serializer
  attributes :id,
    :nickname,
    :external_id,
    :public_key,
    :sign_count,
    :created_at,
    :updated_at
end

