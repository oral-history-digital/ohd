class AddUniqueIndexToTranslations < ActiveRecord::Migration[8.0]
  def change
    # cleanup dublicated entries first
    Interview.find_each(batch_size: 100) do |i| 
      segment_ids = Segment::Translation.where(segment_id: i.segment_ids).group(:segment_id, :locale).having("count(*) > 1").pluck(:segment_id)
      if segment_ids.count > 0
        segment_ids.each do |segment_id|
          segment = Segment.find(segment_id)
          segment.translations.group(:locale).having("count(*) > 1").each do |translation_group|
            persisting_attributes = {}
            Segment.translated_attribute_names.each do |attr_name|
              value = segment.translations.where.not(attr_name => [nil, '']).order(created_at: :desc).first&.send(attr_name)
              persisting_attributes[attr_name] = value if value
            end
            segment.translations.where(locale: translation_group.locale).destroy_all
            Segment::Translation.create!(persisting_attributes.merge(segment_id: segment.id, locale: translation_group.locale))
          end
        end
      end
    end

    Project.all.each do |p| 
      person_ids = Person::Translation.where(person_id: p.person_ids).group(:person_id, :locale).having("count(*) > 1").pluck(:person_id)
      if person_ids.count > 0
        person_ids.each do |person_id|
          person = Person.find(person_id)
          person.translations.group(:locale).having("count(*) > 1").each do |translation_group|
            persisting_attributes = {}
            Person.translated_attribute_names.each do |attr_name|
              value = person.translations.where.not(attr_name => [nil, '']).order(created_at: :desc).first&.send(attr_name)
              persisting_attributes[attr_name] = value if value
            end
            person.translations.where(locale: translation_group.locale).destroy_all
            Person::Translation.create!(persisting_attributes.merge(person_id: person.id, locale: translation_group.locale))
          end
        end
      end
    end

    Project.all.each do |p| 
      registry_entry_ids = RegistryEntry::Translation.where(registry_entry_id: p.registry_entry_ids).group(:registry_entry_id, :locale).having("count(*) > 1").pluck(:registry_entry_id)
      if registry_entry_ids.count > 0
        registry_entry_ids.each do |registry_entry_id|
          registry_entry = RegistryEntry.find(registry_entry_id)
          registry_entry.translations.group(:locale).having("count(*) > 1").each do |translation_group|
            persisting_attributes = {}
            RegistryEntry.translated_attribute_names.each do |attr_name|
              value = registry_entry.translations.where.not(attr_name => [nil, '']).order(created_at: :desc).first&.send(attr_name)
              persisting_attributes[attr_name] = value if value
            end
            registry_entry.translations.where(locale: translation_group.locale).destroy_all
            RegistryEntry::Translation.create!(persisting_attributes.merge(registry_entry_id: registry_entry.id, locale: translation_group.locale))
          end
        end
      end
    end

    interview_ids = Interview::Translation.group(:interview_id, :locale).having("count(*) > 1").pluck(:interview_id)
    if interview_ids.count > 0
      interview_ids.each do |interview_id|
        interview = Interview.find(interview_id)
        interview.translations.group(:locale).having("count(*) > 1").each do |translation_group|
          persisting_attributes = {}
          Interview.translated_attribute_names.each do |attr_name|
            value = interview.translations.where.not(attr_name => [nil, '']).first&.send(attr_name)
            persisting_attributes[attr_name] = value if value
          end
          interview.translations.where(locale: translation_group.locale).destroy_all
          Interview::Translation.create!(persisting_attributes.merge(interview_id: interview.id, locale: translation_group.locale))
        end
      end
    end

    %w(
      biographical_entry
      help_text
      photo
      metadata_field
      registry_reference_type
      registry_name
      language
      collection
      contribution_type
      map_section
      material
      project
      translation_value
      annotation
      institution
      task_type
      event
      text
      registry_name_type
      external_link
      role
      event_type
    ).each do |table_name|
      thing_ids = table_name.classify.constantize::Translation.group("#{table_name}_id", :locale).having("count(*) > 1").pluck("#{table_name}_id")
      if thing_ids.count > 0
        thing_ids.each do |thing_id|
          thing = table_name.classify.constantize.find(thing_id)
          thing.translations.group(:locale).having("count(*) > 1").each do |translation_group|
            persisting_attributes = {}
            table_name.classify.constantize.translated_attribute_names.each do |attr_name|
              value = thing.translations.where.not(attr_name => [nil, '']).order(created_at: :desc).first&.send(attr_name)
              persisting_attributes[attr_name] = value if value
            end
            thing.translations.where(locale: translation_group.locale).destroy_all
            table_name.classify.constantize::Translation.create!(persisting_attributes.merge("#{table_name}_id": thing.id, locale: translation_group.locale))
          end
        end
      end
    end

    # now add indices
    %w(
      biographical_entry
      help_text
      photo
      metadata_field
      registry_reference_type
      registry_name
      language
      collection
      contribution_type
      map_section
      registry_entry
      material
      segment
      project
      translation_value
      person
      annotation
      institution
      task_type
      event
      text
      registry_name_type
      external_link
      role
      event_type
    ).each do |table_name|
      add_index "#{table_name}_translations".to_sym, ["#{table_name}_id", :locale],
                unique: true,
                name: "index_#{table_name}_translations_on_ass_id_and_locale"
    end
  end
end
