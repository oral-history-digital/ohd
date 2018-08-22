require 'globalize'

class Annotation < ActiveRecord::Base
  include IsoHelpers

  belongs_to :interview
  belongs_to :user_content
  belongs_to :author

  belongs_to :segment

  translates :text

  # Validation: either interview_id or user_content_id must be nil
  validates_numericality_of :interview_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.user_content_id.nil?}
  validates_numericality_of :user_content_id,
                            :allow_nil => true,
                            :less_than => 0,
                            :unless => Proc.new{|i| i.interview_id.nil?}

  def localized_hash
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = ActionView::Base.full_sanitizer.sanitize(text(projectified(locale))).gsub("&nbsp;", " ")  if Project.available_locales.include?( locale.to_s )
      mem
    end
  end

end
