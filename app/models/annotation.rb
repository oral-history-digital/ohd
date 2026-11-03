require 'globalize'

class Annotation < ApplicationRecord
  include RefreshesSearchIndex

  belongs_to :interview
  belongs_to :user_content

  belongs_to :segment, counter_cache: true

  translates :text, fallbacks_for_empty_translations: false, touch: true
  accepts_nested_attributes_for :translations

  # Validation: either interview_id or user_content_id must be nil
  validates_numericality_of :interview_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.user_content_id.nil?}
  validates_numericality_of :user_content_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.interview_id.nil?}

  searchable auto_index: false, auto_remove: false do
    string :archive_id do
      interview ? interview.archive_id : nil
    end

    string :workflow_state
    integer :id
    integer :segment_id

    I18n.available_locales.each do |locale|
      text :"text_#{locale}", stored: true do
        text(locale)
      end
    end
  end

  refresh_search_index_on :interview_id, :segment_id, :workflow_state, translations: [:text]

  # Updates annotation text embedded in the current and previous interviews.
  #
  # @return [Hash{String => Array<Integer>}] Annotation and interview documents
  def search_index_targets
    { 'Annotation' => [id], 'Interview' => search_index_interview_ids }
  end
end
