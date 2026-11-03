class BiographicalEntry < ApplicationRecord
  include RefreshesSearchIndex

  belongs_to :person, touch: true

  translates :text, :start_date, :end_date, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  refresh_search_index_on :person_id, :workflow_state, translations: [:text, :start_date]

  # Refreshes biography documents and interview text for the current and former person.
  #
  # @return [Hash{String => Array<Integer>}] Biography and interview documents
  def search_index_targets
    person_ids = ([person_id] + Array(saved_change_to_person_id)).compact.uniq
    { 'BiographicalEntry' => [id],
      'Interview' => Contribution.where(person_id: person_ids).pluck(:interview_id) }
  end

  scope :with_public_state, ->{ where(workflow_state: 'public') }

  searchable auto_index: false, auto_remove: false do
    string :archive_id, :multiple => true, :stored => true do
      person ? person.interviews.map{|i| i && i.archive_id } : ''
    end
    string :workflow_state
    string :start_date, :stored => true
    I18n.available_locales.each do |locale|
      text :"text_#{locale}", stored: true do
        text(locale)
      end
    end
  end

  def interview_id
    person.interviews.first && person.interviews.first.id
  end

  def public?
    workflow_state == 'public'
  end
end
