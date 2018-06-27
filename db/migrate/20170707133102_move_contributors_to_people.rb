class MoveContributorsToPeople < ActiveRecord::Migration[5.0]
  def change
  unless Project.name.to_sym == :mog
    add_column :contributions, :person_id, :integer

    Contributor.find_each do |c|
      locales = c.translations.map(&:locale)
      last_locale = locales.pop

      I18n.locale = last_locale
      person = Person.find_or_create_by( 
        first_name: c.first_name,
        last_name: c.last_name
      )

      locales.each do |locale|
        I18n.locale = locale
        person.update_attributes( 
          first_name: c.first_name,
          last_name: c.last_name
        )
      end

      c.contributions.each do |contribution| 
        contribution.update_attributes person_id: person.id
      end
    end

    drop_table :contributors
    drop_table :contributor_translations

    remove_column :contributions, :contributor_id
  end
  end
end
