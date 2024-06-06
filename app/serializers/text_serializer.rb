class TextSerializer < ApplicationSerializer
  attributes :id, :code, :project_id, :text

  def text
    object.localized_hash(:text)
  end
end
