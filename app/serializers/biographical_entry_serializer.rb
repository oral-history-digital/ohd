class BiographicalEntrySerializer < ApplicationSerializer

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
      object.translations.inject({}) do |mem, translation|
        mem[translation.locale] = object.send(entry, translation.locale) 
        mem
      end
    end
  end

end
