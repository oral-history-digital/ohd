require 'globalize'

class Language < ApplicationRecord

  RTL_LANGUAGES = %w( Hebräisch Arabisch )

  translates :name, :abbreviated, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  has_many :interviews

  after_update :touch_interviews

  class << self
    def find_by_code_or_name(name_or_code)
      joins(:translations).
        where("name = ? OR code = ?", name_or_code, name_or_code).
        first
    end

    def find_with_iso_code(iso_code)
      iso_results = ISO_639.find(iso_code)
      Language.joins(:translations).where(name: iso_results).
        or(Language.joins(:translations).where(code: iso_results)).
        first
    end
  end

  def to_s(locale = I18n.locale)
    name(locale)
  end

  def direction
    @direction ||= RTL_LANGUAGES.include?(name) ? 'RTL' : 'LTR'
  end

  def alpha2
    ISO_639.find(code).alpha2
  end

  private

  def touch_interviews
    interviews.update_all(updated_at: DateTime.now)
  end

end
