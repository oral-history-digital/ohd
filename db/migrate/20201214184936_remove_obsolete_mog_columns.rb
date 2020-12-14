class RemoveObsoleteMogColumns < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      remove_column(:annotation_translations, :annotation_section_id, if_exists: true)
      remove_column(:annotations, :section_id, if_exists: true)
      remove_column(:contributions, :interview_section_id, if_exists: true)
      remove_column(:contributions, :dedalo_id, if_exists: true)
      remove_column(:histories, :person_dedalo_id, if_exists: true)
      remove_column(:histories, :section_id, if_exists: true)
      remove_column(:interview_translations, :interview_section_id, if_exists: true)
      remove_column(:interviews, :section_id, if_exists: true)
      remove_column(:photos, :interview_section_id, if_exists: true)
      remove_column(:registry_entries, :entry_code, if_exists: true)
      remove_column(:registry_name_translations, :registry_name_dedalo_id, if_exists: true)
      remove_column(:registry_hierarchies, :ancestor_dedalo_id, if_exists: true)
      remove_column(:registry_hierarchies, :descendant_dedalo_id, if_exists: true)
      remove_column(:registry_references, :interview_section_id, if_exists: true)
      remove_column(:tapes, :section_id, if_exists: true)
      remove_column(:tapes, :interview_section_id, if_exists: true)
      remove_column(:segments, :section_id, if_exists: true)
      remove_column(:segments, :interview_section_id, if_exists: true)
      remove_column(:segments, :note_section_id, if_exists: true)
      remove_column(:segments, :term_id, if_exists: true)
      remove_column(:segment_translations, :section_id, if_exists: true)
    end
  end
end
