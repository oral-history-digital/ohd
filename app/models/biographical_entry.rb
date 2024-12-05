class BiographicalEntry < ApplicationRecord

  belongs_to :person, touch: true

  translates :text, :start_date, :end_date, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  scope :with_public_state, ->{ where(workflow_state: 'public') }

  searchable do
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

  def for_latex(locale)
    sanitized_text = ActionView::Base.full_sanitizer.sanitize(text(locale))
      .gsub("&amp;", "&")
    escaped_text = LatexToPdf.escape_latex(sanitized_text)
    escaped_text.gsub(/\r?\n/, '~\newline~')
  end

  def public?
    workflow_state == 'public'
  end
end
