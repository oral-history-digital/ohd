class IntervieweeSerializer < ActiveModel::Serializer
  attributes :id, :date_of_birth, :gender, :histories

  def histories
    object.histories.map{ |history|
      history.translations.each_with_object({}) {|i, hsh |
        hsh[i.locale] = {event_begin: i.deportation_date,
                         event_end: i.return_date,
                         event_description: i.forced_labor_details}}}
  end

end
