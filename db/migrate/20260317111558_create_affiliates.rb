class CreateAffiliates < ActiveRecord::Migration[7.0]
  class MigrationProject < ApplicationRecord
    self.table_name = 'projects'
  end

  class MigrationAffiliate < ApplicationRecord
    self.table_name = 'affiliates'
    self.inheritance_column = :_type_disabled

    translates :name, :first_name, :last_name
  end

  class MigrationAffiliateTranslation < ApplicationRecord
    self.table_name = 'affiliate_translations'
  end

  AFFILIATE_MAPPING = {
    cooperation_partner: 'CooperationPartner',
    leader: 'Leader',
    manager: 'Manager',
    funder_names: 'Funder',
  }.freeze

  PERSONAL_TYPES = %w[Leader Manager].freeze

  def up
    create_table :affiliates do |t|
      t.string :type
      t.string :name_type
      t.integer :project_id

      t.timestamps
    end

    add_index :affiliates, :project_id

    MigrationAffiliate.create_translation_table!(
      {
        name: :string,
        first_name: :string,
        last_name: :string,
      },
      migrate_data: false
    )

    migrate_project_columns_to_affiliates

    remove_column :projects, :cooperation_partner, :string
    remove_column :projects, :leader, :string
    remove_column :projects, :manager, :string
    remove_column :projects, :funder_names, :string
  end

  def down
    add_column :projects, :cooperation_partner, :string unless column_exists?(:projects, :cooperation_partner)
    add_column :projects, :leader, :string unless column_exists?(:projects, :leader)
    add_column :projects, :manager, :string unless column_exists?(:projects, :manager)
    add_column :projects, :funder_names, :string unless column_exists?(:projects, :funder_names)

    restore_project_columns_from_affiliates

    MigrationAffiliate.drop_translation_table!(migrate_data: false) if table_exists?(:affiliate_translations)

    remove_index :affiliates, :project_id if index_exists?(:affiliates, :project_id)
    drop_table :affiliates if table_exists?(:affiliates)
  end

  private

  def migrate_project_columns_to_affiliates
    MigrationProject.reset_column_information
    MigrationAffiliate.reset_column_information
    MigrationAffiliateTranslation.reset_column_information if table_exists?(:affiliate_translations)

    MigrationProject.find_each do |project|
      AFFILIATE_MAPPING.each do |attribute, affiliate_type|
        split_affiliate_names(project.send(attribute)).each do |raw_name|
          affiliate = MigrationAffiliate.create!(
            type: affiliate_type,
            name_type: PERSONAL_TYPES.include?(affiliate_type) ? 'Personal' : 'Organizational',
            project_id: project.id
          )

          translation_attributes =
            if PERSONAL_TYPES.include?(affiliate_type)
              first_name, last_name = split_person_name(raw_name)
              {
                locale: 'de',
                first_name: first_name,
                last_name: last_name
              }
            else
              {
                locale: 'de',
                name: raw_name
              }
            end

          MigrationAffiliateTranslation.create!(
            translation_attributes.merge(affiliate_id: affiliate.id)
          )
        end
      end
    end
  end

  def restore_project_columns_from_affiliates
    return unless table_exists?(:affiliates)
    return unless table_exists?(:affiliate_translations)

    MigrationProject.reset_column_information
    MigrationAffiliate.reset_column_information
    MigrationAffiliateTranslation.reset_column_information

    MigrationProject.find_each do |project|
      affiliates = MigrationAffiliate.where(project_id: project.id)
      updates = {}

      AFFILIATE_MAPPING.each do |attribute, affiliate_type|
        scoped_affiliates = affiliates.where(type: affiliate_type)

        names = scoped_affiliates.map do |affiliate|
          translation = MigrationAffiliateTranslation.find_by(
            affiliate_id: affiliate.id,
            locale: 'de'
          )

          next if translation.blank?

          if PERSONAL_TYPES.include?(affiliate_type)
            [translation.first_name, translation.last_name]
              .map(&:to_s)
              .map(&:strip)
              .reject(&:blank?)
              .join(' ')
          else
            translation.name.to_s.strip
          end
        end.reject(&:blank?).uniq

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
        # fall through
      end
    end

    value.split(/[,;]/)
         .map { |name| name.gsub(/\A[\[\]"]+|[\[\]"]+\z/, '').strip }
         .reject(&:blank?)
  end

  def split_person_name(full_name)
    parts = full_name.to_s.strip.split(/\s+/)
    return ['', ''] if parts.empty?
    return ['', parts.first] if parts.length == 1

    first_name = parts[0...-1].join(' ')
    last_name = parts[-1]

    [first_name, last_name]
  end
end
