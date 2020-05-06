class TransformTypologiesToRegistryEntries < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      typology_rrt = RegistryReferenceType.create name: 'Typology', code: 'typology'

      typology_re = RegistryEntry.create_with_parent_and_names(1, "de::Typologie##el::Εμπειρία", 'typology')

      %w(resistance occupation flight concentration_camp persecution_of_jews retaliation collaboration).each do |typology|
        RegistryEntry.create_with_parent_and_names(typology_re.id, "de::#{I18n.t(typology, :de)}##el::#{I18n.t(typology, :el)}", typology)
      end

      Person.all.each do |person|
        person.typology.split(",").each do |t|
          re = RegistryEntry.where(code: t.parameterize(separator: "_")).first
          RegistryReference.create registry_entry_id: re.id, ref_object_id: person.id, ref_object_type: 'Person', registry_reference_type_id: typology_rrt.id, ref_position: 0, original_descriptor: "", ref_details: "", ref_comments: "", ref_info: "", workflow_state: "checked", interview_id: person.interviews.first && person.interviews.first.id
        end
      end

      remove_column :people, :typology
    end
  end
end
