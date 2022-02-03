class LinkProjectsAndCollectionsToInstitutions < ActiveRecord::Migration[5.2]
  def up
    add_column :collections, :institution_id, :integer
    remove_column :institutions, :name
    remove_column :institutions, :description
    Institution.create_translation_table! name: :string, description: :text

    Collection.all.each do |collection|
      institution = nil
      collection.translations.each do |t|
        if t.institution
          institution = Institution.joins(:translations).where(name: t.institution[0..150]).first unless institution
          if institution
            institution.update_attributes(name: t.institution[0..150], description: t.institution, locale: t.locale)
          else
            institution = Institution.create(name: t.institution[0..150], description: t.institution, locale: t.locale)
          end
        end
      end
      collection.update_attributes(institution_id: institution.id) if institution
    end

    Project.all.each do |project|
      institution = nil
      if project.hosting_institution
        institution = Institution.joins(:translations).where(name: project.hosting_institution[0..150]).first unless institution
        if institution
          institution.update_attributes(name: project.hosting_institution[0..150], description: project.hosting_institution, locale: :de)
        else
          institution = Institution.create(name: project.hosting_institution[0..150], description: project.hosting_institution, locale: :de)
        end
        InstitutionProject.create(institution_id: institution.id, project_id: project.id) if institution
      end
    end

    Project.update_all(updated_at: Time.now)

    remove_column :collection_translations, :institution
    remove_column :projects, :hosting_institution
  end

  def down
    add_column :institutions, :name, :string
    add_column :institutions, :description, :text
    remove_column :institution_translations, :name
    remove_column :institution_translations, :description
    remove_column :collections, :institution_id
    Collection.add_translation_fields! institution: :string
    add_column :projects, :hosting_institution
  end
end
