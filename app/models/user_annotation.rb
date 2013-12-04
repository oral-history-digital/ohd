class UserAnnotation < UserContent
  include Workflow

  # A UserAnnotation is a UserContent referencing an interview segment.
  # In it's normal, base state, it is just a private user_content.
  # It can be published as a shared annotation. However, this publication
  # is subject to an approval process by the editorial team.

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
    end
    state :shared do
      event :withdraw, :transitions_to => :postponed
      event :remove, :transitions_to => :rejected
    end
    state :rejected do
      event :review, :transitions_to => :proposed
    end
  end

  validates_format_of :reference_type, :with => /^Segment$/

  # TODO: change this: add a user_annotation as user_content,
  # this object also carries the workflow.
  # THEN create an annotation object that is equivalent on publishing!

  # TODO: need to complete user_content functionality

  def accept
    create_annotation
  end

  def remove
    delete_annotation
  end

  def withdraw
    delete_annotation
  end

  def text
    read_property :text
  end

  def text=(blurb)
    write_property :text, blurb
  end

  def author
    read_property :author
  end

  def author=(name)
    write_property :author, name
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
    attr[:properties] = {
        :author => [user.first_name, user.last_name].join(' '),
        :text => read_property(:text) || ''
    }
    attr
  end

  private

  def create_annotation

  end

  def delete_annotation

  end

end