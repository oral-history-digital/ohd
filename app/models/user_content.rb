class UserContent < ApplicationRecord

  CONTENT_TYPES = [ :search, :interview_reference, :user_annotation ]

  ANNOTATION_LIMIT = 300

  belongs_to :user
  belongs_to :project
  belongs_to :reference, :polymorphic => true

  before_validation :store_properties

  validates_presence_of :user_id

  validates_acceptance_of :reference_type, :accept => 'Interview', :if => Proc.new{|content| content.type == InterviewReference }
  validates_length_of :description, :maximum => ANNOTATION_LIMIT

  def after_initialize
    get_properties
  end

  def write_property(name, value)
    get_properties[name.to_s] = value
  end

  def read_property(name)
    get_properties[name.to_s]
  end

  def properties
    get_properties
  end

  # JSON-serialized hashes come out as arrays that need to be re-hashed
  def properties=(props)
    @properties = case props
      when Array
        props.inject({}){|h,v| h[v.first] = v.last; h }
      when Hash
        props
      else
        YAML::load(props.to_s) || {}
    end
  end

  def get_properties
    @properties ||= (YAML.load(read_attribute(:properties) || '') || {})
  end

  # The title is usually created from (translated) attributes of the
  # referenced object (=default title) but may be overridden by the
  # end user.
  def title
    user_title #|| default_title(I18n.locale)
  end

  def user_title
    read_attribute(:title)
  end

  def default_title(locale)
    raise 'must be overridden by user content implementations.'
  end

  def description
    read_attribute(:description) || [I18n.t(:no_placeholder, :content => UserContent.human_attribute_name(:description))].join(' ')
  end

  def reverse_position_order_str
    "#{100000 - position} #{created_at}"
  end

  private

  def store_properties
    write_attribute :properties, properties.stringify_keys.to_yaml
  end

end
