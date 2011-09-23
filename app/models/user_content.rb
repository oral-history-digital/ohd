class UserContent < ActiveRecord::Base

  belongs_to :user

  before_save :store_properties
  after_validation_on_create :check_persistence

  attr_accessible :user_id, :title, :interview_references, :properties, :persistent

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

  private

  def store_properties
    write_attribute :properties, @properties.to_yaml
  end

  def check_persistence
    if read_attribute(:persistence).nil?
      false
    else
      true
    end
  end

end