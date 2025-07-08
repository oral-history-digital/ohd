class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def localized_hash(att)
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = localized_value(att, locale) 
      mem
    end
  end

  def localized_value(att, locale)
    self.send(att, locale)
  rescue ArgumentError => e
    self.send(att)
  end

  # following method is only used in models with a worflow_state-attribute
  # these models included Workflow before, but for most of our models except 
  # UserRegistration and Task Workflow is useless and would just complicate things
  # or result in workarounds which kill all of it s functionality like
  # commit bc6182762df3bad2cf62421c35e346c0c61af995
  #
  def workflow_states
    ['public', 'unshared']
  end

  def identifier
    self.id
  end

  def ohd_subject_registry_entry_ids
    if respond_to?(:interviews) && RegistryEntry.ohd_subjects
      RegistryReference.where(
        registry_entry_id: RegistryEntry.ohd_subjects.children.pluck(:id),
        ref_object_id: interviews.pluck(:id),
        ref_object_type: "Interview",
      ).pluck(:registry_entry_id).uniq
    else
      []
    end
  end

  def ohd_subject_registry_entries
    if respond_to?(:interviews)
      ohd_subject_registry_entry_ids.map do |id|
        {
          descriptor: RegistryEntry.find(id).localized_hash(:descriptor),
        }
      end
    else
      []
    end
  end

  def ohd_level_of_indexing_registry_entry_groups
    if respond_to?(:interviews) && RegistryEntry.ohd_level_of_indexing
      RegistryReference.where(
        registry_entry_id: RegistryEntry.ohd_level_of_indexing.children.pluck(:id),
        ref_object_id: interviews.pluck(:id),
        ref_object_type: "Interview",
      ).group(:registry_entry_id).count
    else
      []
    end
  end

  def ohd_level_of_indexing_registry_entries
    if respond_to?(:interviews)
      ohd_level_of_indexing_registry_entry_groups.map do |id, count|
        {
          descriptor: RegistryEntry.find(id).localized_hash(:descriptor),
          count: count
        }
      end
    else
      []
    end
  end
end
