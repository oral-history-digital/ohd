class UserAnnotation < UserContent
  include Workflow

  # A UserAnnotation is a UserContent referencing an interview segment.
  # In it's normal, base state, it is just a private user_content.
  # It can be published as a shared annotation. However, this publication
  # is subject to an approval process by the editorial team.

  has_one :annotation, :dependent => :destroy, :foreign_key => :user_content_id

  named_scope :for_interview, lambda{|interview| {:conditions => ['reference_type = ? and interview_references LIKE ?', 'Segment', "%#{interview.archive_id}%"]}}
  named_scope :for_user, lambda{|user| {:conditions => ['user_id = ?', user.id]}}
  # Note: I'm leaving a LIKE operator here instead of identity comparison to ensure full
  # compatibility to previous, property-based implementation (could be optimized later if not needed)
  named_scope :for_media_id, lambda{|m_id| { :conditions => ['reference_type = ? and media_id LIKE ?', 'Segment', "%#{m_id}"] } }

  PUBLICATION_STATES = %w(proposed postponed rejected shared)
  STATES = PUBLICATION_STATES + %w(private)

  workflow do
    state :private do
      event :submit, :transitions_to => :proposed
    end
    state :proposed do
      event :accept, :transitions_to => :shared
      event :reject, :transitions_to => :rejected
      event :postpone, :transitions_to => :postponed
      event :retract, :transitions_to => :private
    end
    state :postponed do
      event :accept, :transitions_to => :shared
      event :reject, :transitions_to => :rejected
      event :retract, :transitions_to => :private
    end
    state :shared do
      # withdrawn by moderation - subject to alteration
      event :withdraw, :transitions_to => :postponed
      # removed by moderation, no resubmission possible
      event :remove, :transitions_to => :rejected
      # retracted by user
      event :retract, :transitions_to => :private
    end
    state :rejected do
      event :review, :transitions_to => :proposed
      event :retract, :transitions_to => :private
    end
  end

  attr_accessible :description, :title, :position

  validates_format_of :reference_type, :with => /^Segment$/
  validates_uniqueness_of :reference_id, :scope => :user_id

  # 1. validates for existing media_id
  # 2. disable changes to description if not private or proposed
  def validate
    unless media_id =~ Regexp.new("#{CeDiS.config.project_initials.upcase}\\d{3}_\\d{2}_\\d{2}_\\d{4}")
      errors.add :media_id, 'Invalid Media ID given.'
    end
    if description_changed?
      unless private?
        errors.add :description, :modification_not_allowed
      end
    end
  end

  def author
    read_property :author
  end

  def author=(name)
    write_property :author, name
  end

  def archive_id
    media_id[Regexp.new("^#{CeDiS.config.project_initials}\\d{3}", Regexp::IGNORECASE)].downcase
  end

  def timecode_string
    @timecode_string ||= "#{Tape.human_name} #{reference.tape.number}, #{reference.timecode.to_s.sub(/^\[\d+\]/,'').split('.').first || ''}"
  end

  def translated=(trans)
    write_property :translated, trans
  end

  # does the annotation refer to the original or translated transcript?
  def translated?
    trans = read_property :translated
    trans.nil? ? true : trans
  end

  def heading
    read_property :heading
  end

  def default_title(locale)
    title_tokens = [UserAnnotation.human_name(:locale => locale) + I18n.t('user_interface.annotations.connective', :locale => locale)]
    title_tokens << reference.interview.short_title(locale)
    title_tokens << "(#{reference.interview.archive_id})"
    title_tokens << reference.tape_number
    title_tokens << reference.timecode.sub(/\[\d+\]\s+/,'')
    title_tokens.join(' ')
  end

  # provides user_content attributes for new user_content
  # except the link_url, which is generated in the view
  def user_content_attributes
    attr = {}
    attr[:interview_references] = reference.interview.archive_id
    @properties ||= {}
    @properties[:author] ||= [user.first_name, user.last_name].join(' ')
    heading_segment = Segment.with_heading.for_media_id(reference.media_id).first
    unless heading_segment.nil?
      @properties[:heading] = [heading_segment.section, heading_segment.subheading(I18n.locale).blank? ? heading_segment.mainheading(I18n.locale) : heading_segment.subheading(I18n.locale)].join(' ')
    end
    attr[:properties] = @properties
    attr
  end

  def submit
    update_attribute :submitted_at, Time.now
  end

  def accept
    create_annotation
  end

  def withdraw
    delete_annotation
  end

  def remove
    delete_annotation
  end

  def retract
    update_attribute :submitted_at, nil
    delete_annotation
  end

  # path to show the resource
  def get_content_path
    if reference.nil?
      # just a failsafe - this could fail workbook view rendering
      super.get_content_path
    else
      item = reference.tape.number
      position = reference.start_time.round
      interview_path(reference.interview, :item => item, :position => position)
    end
  end

  private

  def create_annotation
    update_attribute :shared, true
    if annotation.nil?
      annotation = Annotation.create do |a|
        a.text = description # This implicitly creates an annotation text with the default locale.
        a.author = author
        a.media_id = reference.media_id
        a.timecode = reference.timecode
        # don't assign an interview_id
        a.user_content_id = self.id
      end
      self.reload
    end
  end

  def delete_annotation
    update_attribute :shared, false
    unless annotation.nil?
      annotation.destroy
      self.reload
    end
  end

  def self.default_id_hash(instance)
    Base64.encode64(instance.send(:media_id) || 'blank').sub(/\\n$/,'')
  end

end
