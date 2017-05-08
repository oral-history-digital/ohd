require 'globalize'

class RegistryName < ActiveRecord::Base

  belongs_to :registry_entry
  belongs_to :registry_name_type

  translates :descriptor

  named_scope :ordered_by_type,
              -> { joins(:registry_name_type).
                   order('registry_name_types.order_priority, registry_names.name_position') }

  named_scope :with_type, -> (code) { where(registry_name_types: {code: code.to_s}) }

  def descriptor_with_locales=(data)
    begin
      # Temporarily add :alias to the available
      # locales to avoid update errors in the
      # versioning plugin.
      I18n.available_locales << :alias

      case data
        when String
          self.descriptor_without_locales=(data)
        when Hash
          # NB: Put the alias locale first and make sure that
          # at least the default locale will always be written
          # so that the versioning plugin will return to a
          # 'normal' locale before saving.
          ([:alias] + I18n.available_locales).each do |locale|
            next if locale != I18n.default_locale and
                data[locale.to_s].blank? and
                translations.detect{|t| t.locale == locale}.blank?
            descriptor = if data[locale.to_s].blank?
                           nil
                         else
                           data[locale.to_s]
                         end
            RegistryName.with_locale(locale) do
              self.descriptor_without_locales=(descriptor)
            end
          end
      end

    ensure
      I18n.available_locales.reject!{|locale| locale == :alias}
    end
  end
  alias_method_chain :descriptor=, :locales

  def to_hash
    # We have to reset the globalize plugin otherwise language fallbacks
    # won't work correctly after updating the model.
    globalize.reset
    {
        :id => id,
        :registryNameType => registry_name_type.to_hash,
        :namePosition => name_position,
        :descriptor => (I18n.available_locales + [:alias]).inject({}) do |result, locale|
          if locale != :alias or
              (locale == :alias and descriptor(:alias) != descriptor(I18n.default_locale))
            result[locale] = descriptor(locale)
          end
          result
        end
    }
  end
end
