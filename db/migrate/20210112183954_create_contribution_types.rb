class CreateContributionTypes < ActiveRecord::Migration[5.2]
  def up
    create_table :contribution_types do |t|
      t.integer :project_id
      t.timestamps
    end
    add_column :contributions, :contribution_type_id, :integer

    ContributionType.create_translation_table! label: :string

    Contribution.group(:contribution_type).count.each do |type, count|
      contribution_type = ContributionType.create project_id: Project.first.id
      Project.first.available_locales.each do |locale|
        contribution_type.update_attributes label: I18n.t("contributions.#{type}", locale: locale), locale: locale
      end
      Contribution.where(contribution_type: type).update_all(contribution_type_id: contribution_type.id)
    end
  end

  def down
    drop_table :contribution_type_translations
    drop_table :contribution_types
    remove_column :contributions, :contribution_type_id
  end
end
