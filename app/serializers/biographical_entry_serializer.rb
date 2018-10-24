class BiographicalEntrySerializer < ActiveModel::Serializer

  attributes :id, :person_id, 
    :text, 
    :end_date, 
    :start_date,
    :workflow_state,
    :transitions_to

  def transitions_to
    object.current_state.events.map{|e| e.first}
  end

  [:text, :end_date, :start_date].each do |entry|
    define_method entry do
      I18n.available_locales.inject({}) do |mem, locale|
        mem[locale] = object.send(entry, locale) if Project.available_locales.include?( locale.to_s )
        mem
      end
    end
  end

end
