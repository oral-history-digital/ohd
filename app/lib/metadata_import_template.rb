class MetadataImportTemplate

  def initialize(project, locale)
    @locale = locale
    @project = project
    @csv = CSV.generate(headers: true, col_sep: "\t", row_sep: :auto, quote_char: "\x00") do |csv|
      csv << columns_hash.values
    end
  end

  def csv
    @csv
  end

  def columns_hash
    hash = {}
    hash.update(default_interview_columns)
    hash.update(default_interviewee_columns)
    hash.update(default_contributor_columns)
    hash.update(registry_reference_type_import_metadata_field_columns)
    hash
  end

  def default_interview_columns
    [
      :archive_id,
      :signature_original,
      :first_language,
      :second_language,
      :first_translation_language,
      :collection_id,
      :interview_date,
      :media_type,
      :duration,
      :observations,
      :description,
      :tape_count,
      :link_to_interview,
    ].inject({}) do |mem, c| 
      mem[c] = I18n.t("metadata_labels.#{c}", locale: @locale)
      mem
    end
  end

  def default_interviewee_columns
    [
      :first_name,
      :last_name,
      :birth_name,
      :alias_names,
      :other_first_names,
      :pseudonym_first_name,
      :pseudonym_last_name,
      :use_pseudonym,
      :person_description,
      :gender,
      :date_of_birth,
      :biography,
      :biography_public,
    ].inject({}) do |mem, c| 
      mem[c] = I18n.t("activerecord.attributes.person.#{c}", locale: @locale)
      mem
    end
  end

  def default_contributor_columns
    @project.contribution_types.where(use_in_export: true).inject({}) do |mem, c| 
      mem[c.code.to_sym] = I18n.t("contributions.#{c.code}", locale: @locale)
      mem
    end
  end

  def registry_reference_type_import_metadata_field_columns
    @project.registry_reference_type_import_metadata_fields.inject({}) do |mem, field|
      label = field.label(@locale)
      mem["rrt_#{field.registry_reference_type_id}".to_sym] = label
      mem["rrt_sub_#{field.registry_reference_type_id}".to_sym] = "#{label} (direkter Oberbegriff)"
      mem
    end
  end

end
