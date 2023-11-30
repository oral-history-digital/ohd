class SlimRegistryReferenceSerializer < ActiveModel::Serializer
  attributes :id, :archive_id, :display_name, :first_name, :last_name

  def display_name
    "#{first_name} #{last_name}"
  end

  def first_name
    default_locale = @instance_options[:default_locale]

    first_names = object.use_pseudonym == 1 ?
      JSON.parse(object.agg_pseudonym_first_names) :
      JSON.parse(object.agg_first_names)

    first_names[I18n.locale] || first_names[default_locale] || ''
  end

  def last_name
    default_locale = @instance_options[:default_locale]
    signed_in = @instance_options[:signed_in]

    last_names = object.use_pseudonym == 1 ?
      JSON.parse(object.agg_pseudonym_last_names) :
      JSON.parse(object.agg_last_names)

    full_last_name = last_names[I18n.locale] || last_names[default_locale] || ''

    signed_in ? full_last_name : "#{full_last_name.slice(0, 1)}."
  end
end
