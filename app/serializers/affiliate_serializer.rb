class AffiliateSerializer < ApplicationSerializer
  attributes :id, :type, :name_type, :name, :first_name, :last_name, :project_id

  %w(name first_name last_name).each do |attribute|
    define_method attribute do
      object.localized_hash(attribute.to_sym)
    end
  end

end
