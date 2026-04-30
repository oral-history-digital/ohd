class CreateAffiliates < ActiveRecord::Migration[8.0]
  class MigrationProject < ApplicationRecord
    self.table_name = 'projects'
  end

  class MigrationAffiliate < ApplicationRecord
    self.table_name = 'affiliates'
    self.inheritance_column = :_type_disabled
  end

  AFFILIATE_MAPPING = {
    cooperation_partner: 'CooperationPartner',
    leader: 'Leader',
    manager: 'Manager',
    funder_names: 'Funder',
  }.freeze

  def up
    create_table :affiliates do |t|
      t.string :type
      t.string :name_type
      t.string :name
      t.string :url
      t.integer :project_id

      t.timestamps
    end

    add_index :affiliates, :project_id

    migrate_project_columns_to_affiliates

    remove_column :projects, :cooperation_partner, :string
    remove_column :projects, :leader, :string
    remove_column :projects, :manager, :string
    remove_column :projects, :funder_names, :string
  end

  def down
    add_column :projects, :cooperation_partner, :string
    add_column :projects, :leader, :string
    add_column :projects, :manager, :string
    add_column :projects, :funder_names, :string

    restore_project_columns_from_affiliates

    remove_index :affiliates, :project_id if index_exists?(:affiliates, :project_id)
    drop_table :affiliates if table_exists?(:affiliates)
  end

  private

  def migrate_project_columns_to_affiliates
    MigrationProject.reset_column_information
    MigrationAffiliate.reset_column_information

    MigrationProject.find_each do |project|
      AFFILIATE_MAPPING.each do |attribute, affiliate_type|
        split_affiliate_names(project.send(attribute)).each do |affiliate_name|
          MigrationAffiliate.create!(
              type: affiliate_type,
              name_type: %w(Leader Manager).include?(affiliate_type) ? 'Personal' : 'Organizational',
              name: affiliate_name,
              project_id: project.id
            )
        end
      end
    end
  end

  def restore_project_columns_from_affiliates
    return unless table_exists?(:affiliates)

    MigrationProject.reset_column_information
    MigrationAffiliate.reset_column_information

    MigrationProject.find_each do |project|
      affiliates = MigrationAffiliate.where(project_id: project.id)
      updates = {}

      AFFILIATE_MAPPING.each do |attribute, affiliate_type|
        names = affiliates
                  .where(type: affiliate_type)
                  .pluck(:name)
                  .map(&:to_s)
                  .map(&:strip)
                  .reject(&:blank?)
                  .uniq

        updates[attribute] = names.join('; ') if names.any?
      end

      project.update_columns(updates) if updates.any?
    end
  end

  def split_affiliate_names(raw_value)
    value = raw_value.to_s.strip
    return [] if value.blank?

    if value.start_with?('[')
      begin
        parsed = JSON.parse(value)
        return parsed.map(&:to_s).map(&:strip).reject(&:blank?) if parsed.is_a?(Array)
      rescue JSON::ParserError
        # Fall through to delimiter-based parsing for malformed JSON-like values.
      end
    end

    value.split(/[,;]/)
         .map { |name| name.gsub(/\A[\[\]"]+|[\[\]"]+\z/, '').strip }
         .reject(&:blank?)
  end
end
