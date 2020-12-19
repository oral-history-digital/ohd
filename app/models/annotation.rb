require 'globalize'

class Annotation < ApplicationRecord

  belongs_to :interview
  belongs_to :user_content

  belongs_to :segment, counter_cache: true

  translates :text, fallbacks_for_empty_translations: true, touch: true

  # Validation: either interview_id or user_content_id must be nil
  validates_numericality_of :interview_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.user_content_id.nil?}
  validates_numericality_of :user_content_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.interview_id.nil?}

end
