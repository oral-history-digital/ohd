class UserContent < ActiveRecord::Base

  acts_as_taggable


  #include ActionController::UrlWriter

  CONTENT_TYPES = [ :search, :interview_reference, :user_annotation ]

  ANNOTATION_LIMIT = 300

  belongs_to :user
  belongs_to :reference, :polymorphic => true

  #before_validation_on_create :compile_id_hash
  before_validation :compile_id_hash, :on => :create

  before_validation :store_properties
  #after_validation_on_create :check_persistence, :set_link_url
  after_validation :check_persistence, :set_link_url, :on => :create

  attr_accessible :user_id,
                  :title,
                  :interview_references,
                  :properties,
                  :description,
                  :link_url,
                  :persistent

  validates_presence_of :user_id

  validates_acceptance_of :reference_type, :accept => 'Interview', :if => Proc.new{|content| content.type == InterviewReference }
  validates_associated :reference, :if => Proc.new{|content| content.type != Search }
  validates_uniqueness_of :id_hash, :scope => :user_id
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

  def interview_references
    YAML.load(read_attribute(:interview_references) || '') || []
  end

  def interview_references=(list_of_archive_ids)
    if list_of_archive_ids.is_a?(String)
      list_of_archive_ids = list_of_archive_ids.scan(Regexp.new("#{CeDiS.config.project_initials}\\d{3}", Regexp::IGNORECASE)).map{|id| id.downcase }
    end
    write_attribute :interview_references, list_of_archive_ids.to_yaml
  end

  # The title is usually created from (translated) attributes of the
  # referenced object (=default title) but may be overridden by the
  # end user.
  def title
    user_title || default_title(I18n.locale)
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

  def self.default_id_hash(instance)
    refs = (instance.send(:interview_references) || %w(blank)).join(',')
    Base64.encode64(refs).sub(/\\n$/,'')
  end

  def id_hash
    @id_hash ||= read_attribute :id_hash
    @id_hash = compile_id_hash if @id_hash.blank?
    @id_hash
  end

  # path to show the resource
  def get_content_path
    user_content_path(self)
  end

  def reverse_position_order_str
    "#{100000 - position} #{created_at}"
  end

  private

  def store_properties
    write_attribute :properties, @properties.stringify_keys.to_yaml
  end

  def compile_id_hash
    @id_hash = read_attribute(:type).camelize.constantize.default_id_hash(self)
    write_attribute :id_hash, @id_hash
    @id_hash
  end

  def set_link_url
    update_attribute :link_url, get_content_path.sub(Regexp.new("$#{ActionController::Base.relative_url_root}"),'')
  end

  def check_persistence
    if read_attribute(:persistence).nil?
      false
    else
      true
    end
  end

end
