class CreateAffiliates < ActiveRecord::Migration[8.0]
  def change
    create_table :affiliates do |t|
      t.string :type
      t.string :name_type
      t.string :name
      t.string :url
      t.integer :project_id

      t.timestamps
    end

    add_index :affiliates, :project_id

    mapping = {
      cooperation_partner: 'CooperationPartner',
      leader: 'Leader',
      manager: 'Manager',
      funder_names: 'Funder',
    }

    Project.find_each do |project|
      mapping.each do |attribute, affiliate_type|
        affiliates = project.send(attribute)
        if affiliates.present?
          affiliates.sub("[\"", '').sub("\"]",'').split(/[,;]/).each do |affiliate_name|
            Affiliate.create!(
              type: affiliate_type,
              name_type: %w(Leader Manager).include?(affiliate_type) ? 'Personal' : 'Organizational',
              name: affiliate_name,
              project_id: project.id
            )
          end
        end
      end
    end

    remove_column :projects, :cooperation_partner, :string
    remove_column :projects, :leader, :string
    remove_column :projects, :manager, :string
    remove_column :projects, :funder_names, :string
  end
end
