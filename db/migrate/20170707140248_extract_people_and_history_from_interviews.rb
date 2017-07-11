class ExtractPeopleAndHistoryFromInterviews < ActiveRecord::Migration[5.0]
  def change
    # first create Person with the necessary data from interviews and contributions
    Interview.find_each do |i|
      locales = i.translations.map(&:locale)
      last_locale = locales.pop

      I18n.locale = last_locale
      person = Person.find_or_create_by( 
        first_name: i.first_name,
        last_name: i.last_name,
        birth_name: i.birth_name,
        other_first_names: i.other_first_names,
        alias_names: i.alias_names,
        date_of_birth: i.date_of_birth,
        gender: (i.gender ? 'male' : 'female')
      )

      history = History.find_or_create_by(
        forced_labor_details: i.forced_labor_details,
        return_date: i.return_date,
        deportation_date: i.deportation_date,
        punishment: i.punishment,
        liberation_date: i.liberation_date,
        person_id: person.id
      )

      locales.each do |locale|
        I18n.locale = locale
        person.update_attributes( 
          first_name: i.first_name,
          last_name: i.last_name,
          birth_name: i.birth_name,
          other_first_names: i.other_first_names,
          alias_names: i.alias_names,
          date_of_birth: i.date_of_birth,
          gender: (i.gender ? 'male' : 'female')
        )

        history.update_attributes(
          forced_labor_details: i.forced_labor_details,
          return_date: i.return_date,
          deportation_date: i.deportation_date,
          punishment: i.punishment,
          liberation_date: i.liberation_date,
        )
      end

      Contribution.create person_id: person.id, contribution_type: 'interviewee', interview_id: i.id
    end

    # than remove the columns from interview and interview_translations
    remove_column :interview_translations, :first_name 
    remove_column :interview_translations, :last_name
    remove_column :interview_translations, :birth_name
    remove_column :interview_translations, :forced_labor_details
    remove_column :interview_translations, :other_first_names
    remove_column :interview_translations, :return_date

    remove_column :interviews, :gender
    remove_column :interviews, :date_of_birth
    remove_column :interviews, :deportation_date
    remove_column :interviews, :punishment
    remove_column :interviews, :liberation_date
    remove_column :interviews, :alias_names

  end
end
