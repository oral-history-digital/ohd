class IntervieweeSerializer < ActiveModel::Serializer
  attributes :id, :date_of_birth, :gender, :history


  def history
    object.history.translations
  end

end
