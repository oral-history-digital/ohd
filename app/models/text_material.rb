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
    return if filename.blank?
    filename = (filename || '').sub!(/\w{3,4}$/,'pdf')
    if !defined?(@assigned_filename) || @assigned_filename != filename
      archive_id = ((filename || '')[/^za\d{3}/i] || '').downcase
      @assigned_filename = filename
      # construct the import file path
      # TODO: if the quality setting is not at least 2.0, use the original material, which is:
      # the oldest file matching the pattern in REPOSITORY_DIR, archive_id.upcase, archive_id.upcase + 'archive', 'versions/bm'
      filepath = if !interview.nil? and interview.quality < 2.0
        # use the original text materials
        versions_dir = File.join(ActiveRecord.path_to_storage, REPOSITORY_DIR, archive_id.upcase, archive_id.upcase + '_archive', 'versions', 'bm', (filename || '').split('/').last.to_s[/za\d{3}_\w+}/])
        ctime = Time.now
        original_file = nil
        Dir.glob(versions_dir + '*.pdf').each do |file|
          original_file = file if File.ctime(file) < ctime
        end
        original_file
      else
        # use the specified document path or the default Repository content
        doc_path = File.join(ActiveRecord.path_to_storage, ARCHIVE_MANAGEMENT_DIR, archive_id, 'text', (filename || '').split('/').last.to_s)
        unless File.exists?(doc_path)
          doc_path = File.join(ActiveRecord.path_to_storage, REPOSITORY_DIR, archive_id.upcase, archive_id.upcase + '_archive', 'data', 'bm', (filename || '').split('/').last.to_s)
        end
        doc_path
      end
      File.open(filepath, 'r') do |file|
        self.document = file
      end
    else
      write_attribute :document_file_name, filename
    end
  end

end