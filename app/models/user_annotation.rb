class UserAnnotation < UserContent
  include Workflow

  # A UserAnnotation is a UserContent referencing an interview segment.
  # In it's normal, base state, it is just a private user_content.
  # It can be published as a shared annotation. However, this publication
  # is subject to an approval process by the editorial team.

  named_scope :for_interview, lambda{|interview| {:conditions => ['reference_type = ? and interview_references LIKE ?', 'Segment', "%#{interview.archive_id}%"]}}
  named_scope :for_user, lambda{|user| {:conditions => ['user_id = ?', user.id]}}
  named_scope :for_media_id, lambda{|m_id| { :conditions => ['reference_type = ? and properties LIKE ?', 'Segment', "%media_id: #{m_id}%"] } }

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
      event :withdraw, :transitions_to => :postponed
      event :remove, :transitions_to => :rejected
      event :retract, :transitions_to => :private
    end
    state :rejected do
      event :review, :transitions_to => :proposed
    end
  end

  validates_format_of :reference_type, :with => /^Segment$/

  # validates for existing media_id
  def validate
    unless read_property(:media_id) =~ /ZA\d{3}_\d{2}_\d{2}_\d{4}/
      errors.add :properties, 'Invalid Media ID given.'
    end
  end

  # TODO: change this: add a user_annotation as user_content,
  # this object also carries the workflow.
  # THEN create an annotation object that is equivalent on publishing!

  def accept
    create_annotation
  end

  def remove
    delete_annotation
  end

  def withdraw
    delete_annotation
  end

  def author
    read_property :author
  end

  def author=(name)
    write_property :author, name
  end

  def media_id
    read_property :media_id
  end

  def media_id=(mid)
    write_property :media_id, mid
  end

  def heading
    read_property :heading
  end

  # provides user_content attributes for new user_content
  # except the link_url, which is generated in the view
  def user_content_attributes
    attr = {}
    title_tokens = [Segment.human_name]
    title_tokens << reference.media_id
    title_tokens << reference.timecode.sub(/\[\d+\]\s+/,'')
    attr[:title] = title_tokens.join(' ')
    attr[:interview_references] = reference.interview.archive_id
    @properties ||= {}
    @properties[:author] ||= [user.first_name, user.last_name].join(' ')
    heading_segment = Segment.headings.for_media_id(reference.media_id).first
    unless heading_segment.nil?
      @properties[:heading] = [heading_segment.section, heading_segment.subheading || heading_segment.mainheading].join(' ')
    end
    attr[:properties] = @properties
    attr
  end

  private

  def create_annotation

  end

  def delete_annotation

  end

  def self.default_id_hash(instance)
    Base64.encode64(instance.send(:read_property, :media_id) || 'blank').sub(/\\n$/,'')
  end

end