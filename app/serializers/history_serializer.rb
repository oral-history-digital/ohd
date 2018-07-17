class HistorySerializer < ActiveModel::Serializer

  attributes :id, :person_id, :forced_labor_details, :return_date, :deportation_date, :punishment, :liberation_date

  [:forced_labor_details, :return_date, :deportation_date, :punishment, :liberation_date].each do |entry|
    define_method entry do
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.send(entry, locale) if Project.available_locales.include?( locale.to_s )
        mem
      end
    end
  end

end
