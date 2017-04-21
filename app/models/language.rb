require 'globalize'

class Language < ActiveRecord::Base

  RTL_LANGUAGES = %w( Hebräisch Arabisch )

  translates :name, :abbreviated

  has_many :interviews

  class << self
    def find_by_name(name)
      Language.joins(:translations).includes(:translations).
          where('language_translations.locale = ? AND language_translations.name = ?', 'de', name).first
    end

    def german
      find_by_name 'Deutsch'
    end

    def english
      find_by_name 'Englisch'
    end

    def options
      Language.all.includes(:translations).sort_by(&:name)
    end
  end

  def to_s(locale = I18n.locale)
    name(locale)
  end

  def direction
    @direction ||= RTL_LANGUAGES.include?(name) ? 'RTL' : 'LTR'
  end

end
