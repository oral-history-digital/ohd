class AddPrimaryToInstitutionProjects < ActiveRecord::Migration[8.0]
  def up
    add_column :institution_projects, :primary, :boolean, default: false

    TranslationValue.create(
      key: 'activerecord.attributes.default.primary',
      translations_attributes: [
        { value: 'primär', locale: :de },
        { value: 'primary', locale: :en },
      ]
    )
  end
  def down
    remove_column :institution_projects, :primary

    TranslationValue.where(key: 'activerecord.attributes.default.primary').destroy_all
  end
end
