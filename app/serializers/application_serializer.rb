class ApplicationSerializer < ActiveModel::Serializer
  attributes :id, :type

  def type 
    object.class.name
  end

end

