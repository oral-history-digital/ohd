require 'globalize'

class Annotation < ApplicationRecord

  belongs_to :interview
  belongs_to :user_content

  belongs_to :segment, counter_cache: true

  translates :text, touch: true
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

  searchable do
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
end
