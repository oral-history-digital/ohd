require 'globalize'

class Language < ApplicationRecord
  include RefreshesSearchIndex

  RTL_LANGUAGES = %w( Hebräisch Arabisch )

  translates :name, :abbreviated, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  has_many :interview_languages, dependent: :destroy
  has_many :interviews, through: :interview_languages

  validates :code, presence: true, uniqueness: true

  after_update :touch_interviews

  refresh_search_index_on :code, translations: [:name]

  # Refreshes only interviews linked to this shared language.
  #
  # @return [Hash{String => Array<Integer>}] Affected interview documents
  def search_index_targets
    { 'Interview' => interview_languages.pluck(:interview_id) }
  end

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
    ISO_639.find(code)&.alpha2
  end

  private

  def touch_interviews
    interviews.update_all(updated_at: DateTime.now)
  end

end
