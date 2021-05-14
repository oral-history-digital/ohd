require 'globalize'

class RegistryReferenceType < ApplicationRecord

  translates :name, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates_uniqueness_of :code, scope: :project_id

  # The relation to a registry entry defines "allowed" registry
  # reference types for all registry entries that are descendants
  # of the entry pointed to here.
  belongs_to :registry_entry
  belongs_to :project

  # The relation to registry references defines "assigned"
  # reference types for registry references. These are reference
  # types actually in use to define the type of a reference.
  has_many :registry_references, :dependent => :nullify

  has_one :metadata_field

  def to_s(locale = I18n.locale)
    (metadata_field && metadata_field.label(locale)) || name(locale)
  end

  def to_sym
    code.to_sym
  end

  def to_hash
    {
        :id => id,
        :name => name
    }
  end

end
