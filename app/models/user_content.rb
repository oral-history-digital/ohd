class UserContent < ActiveRecord::Base

  belongs_to :user

  before_create :store_properties, :compile_id_hash
  after_validation_on_create :check_persistence

  attr_accessible :user_id,
                  :title,
                  :interview_references,
                  :properties,
                  :description,
                  :persistent

  validates_presence_of :user_id

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
      else
        props
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
      list_of_archive_ids = list_of_archive_ids.scan(/za\d{3}/i).map{|id| id.downcase }
    end
    write_attribute :interview_references, list_of_archive_ids.to_yaml
  end

  def description
    read_attribute(:description) || [I18n.t(:no_placeholder).capitalize, UserContent.human_attribute_name(:description)].join(' ')
  end

  def self.default_id_hash(instance)
    refs = (instance.send(:read_attribute, :interview_references) || %w(blank)).join(',')
    Base64.encode64(YAML.load(refs)).sub(/\\n$/,'')
  end

  private

  def store_properties
    write_attribute :properties, @properties.to_yaml
  end

  def compile_id_hash
    @id_hash = read_attribute(:type).constantize.default_id_hash(self)
    write_attribute :id_hash, @id_hash
  end

  def check_persistence
    if read_attribute(:persistence).nil?
      false
    else
      true
    end
  end

end