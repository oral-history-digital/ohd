class MediaStreamSerializer < ApplicationSerializer
  attributes :id, :media_type, :path, :resolution, :name

  def name
    "#{object.media_type} #{object.resolution}"
  end
end
