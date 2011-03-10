class TextMaterial < ActiveRecord::Base

  belongs_to :interview

  has_attached_file :document,
                    :url => (ActionController::Base.relative_url_root || '') + '/interviews/:interview/text_materials/:basename.:extension',
                    :path => ':rails_root/assets/archive_text_materials/:interview/:basename.:extension'

  DOCUMENT_TYPES = [
    'Biography',
    'Transcript',
    'Translation'
  ]

  named_scope :of_type, lambda{|type| {:conditions => ['document_type = ?', type ] }}
  named_scope :for_file, lambda{|filename| { :conditions => ['document_file_name = ?', (filename || '') + '.pdf' ]}}

  validates_attachment_presence :document
  # validates_attachment_size does not work here
  validates_numericality_of :document_file_size, :greater_than => 0, :allow_nil => false
  validates_attachment_content_type :document, :content_type => [ 'application/pdf', 'application/x-pdf', 'x-application/pdf' ]
  # validates_presence_of :interview_id
  validates_presence_of :document_type
  validates_inclusion_of :document_type, :in => DOCUMENT_TYPES, :message => "Nur PDF-Dateien sind zulässig."
  validates_uniqueness_of :interview_id, :scope => :document_type

  def document_types
    DOCUMENT_TYPES
  end

  def document_file_name=(filename)
    # assign the document - but skip this part on subsequent changes of the file name
    # (because the filename gets assigned in the process of assigning the file)
    filename.sub!(/\w{3,4}$/,'pdf')
    if !defined?(@assigned_filename) || @assigned_filename != filename
      archive_id = (filename[/^za\d{3}/i] || '').downcase
      @assigned_filename = filename
      # construct the import file path
      filepath = File.join(ActiveRecord.path_to_storage, REPOSITORY_DIR, archive_id.upcase, archive_id.upcase + '_archive', 'data', 'bm', filename.split('/').last)
      File.open(filepath, 'r') do |file|
        self.document = file
      end
    else
      write_attribute :document_file_name, filename
    end
  end

end