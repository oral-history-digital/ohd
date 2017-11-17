class HistoryTranslationSerializer < ActiveModel::Serializer
  attributes :id, :begin_event, :end_event, :event

  def begin_event
    obhject.deportation_date
  end

  def end_event
    obhject.liberation_date
  end

  def event
    object.forced_labor_details
  end

end
