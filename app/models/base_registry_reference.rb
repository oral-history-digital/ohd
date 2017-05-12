require 'i18n/core_ext/string/interpolate'

class BaseRegistryReference < ActiveRecord::Base
  self.abstract_class = true

  belongs_to :ref_object, :polymorphic => true



  belongs_to :registry_entry,
             -> { includes(:registry_names, {main_registers: :registry_names}) }

  belongs_to :registry_reference_type




  validates_presence_of :ref_object, :registry_entry

  WORKFLOW_STATES = [:preliminary, :checked, :rejected]
  validates_inclusion_of :workflow_state, :in => WORKFLOW_STATES.map(&:to_s)

  # Uniqueness constraints are enforced at DB level too, but MySQL does consider NULL values distinct
  # which means that duplicate records with registry_reference_type_id == NULL will not be identified.
  validates_uniqueness_of :ref_position, :registry_entry_id, :scope => [:ref_object_type, :ref_object_id, :registry_reference_type_id]

  scope :with_type, -> (code) {
        joins(:registry_reference_type).
        includes(:registry_reference_type).
        where(registry_reference_type: {code: code.to_s} )
  }

  scope :with_type_id, -> (id) {
        where(registry_reference_type_id: id)
  }

  def to_hash(options = {})
    hash = {
        :id => id,
        :registry_entry => registry_entry.to_hash(:include_hierarchy => options[:include_hierarchy]),
        :registry_reference_type => (registry_reference_type.nil? ? nil : registry_reference_type.to_hash),
        :ref_info => ref_info,
        :ref_position => ref_position
    }
    hash[:registry_entry][:main_registers] = registry_entry.main_registers.map{ |re| re.to_hash(:include_hierarchy => false) }
    if options[:include_ref_object] == true
      hash[:ref_object] = {
          :type => ref_object_type,
          :id => ref_object_id,
          :display_name => case ref_object
                             when Segment then ref_object.media_id
                             when Person then ref_object.interview.archive_id.upcase
                             when NilClass then "??? - Ungültige Nennung eines gelöschten Objekts. Bitte Nennung löschen."
                             else "??? - Nennung eines ungültigen Objekts. Bitte Nennung löschen."
                           end
      }
    end
    hash
  end

end
