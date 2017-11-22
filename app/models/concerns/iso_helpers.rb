require 'active_support/concern'
require 'iso-639'

module IsoHelpers
  extend ActiveSupport::Concern

  included do
  end

  def fit(attribute, locale)
    send(attribute, projectified(locale))
  end

  def projectified(locale)
    code = ISO_639.find(locale.to_s)
    code.send(Project.alpha)
  end

  class_methods do
  end
end
