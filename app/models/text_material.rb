class TextMaterial < ActiveRecord::Base

  belongs_to :interview

  has_attached_file :document,
                    :url => (ActionController::Base.relative_url_root || '') + '/archive_text_materials/:interview/:basename.:extension',
                    :path => ':rails_root/public/archive_text_materials/:interview/:basename.:extension'

  DOCUMENT_TYPES = [
    'Biography',
    'Transcript',
    'Translation'
  ]

=begin
  validates_attachment_presence :document
  # validates_attachment_size does not work here
  validates_numericality_of :document_file_size, :greater_than => 0, :allow_nil => false
  validates_attachment_content_type :document, :content_type => [ 'application/pdf', 'x-application/pdf' ]
  validates_presence_of :interview_id
  validates_presence_of :document_type
  validates_inclusion_of :document_type, :in => DOCUMENT_TYPES, :message => "Nur PDF-Dateien sind zulässig."
  validates_uniqueness_of :interview_id, :scope => :document_type
=end

  def document_types
    DOCUMENT_TYPES
  end

end