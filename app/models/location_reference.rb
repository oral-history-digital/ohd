class LocationReference < ActiveRecord::Base

  # LocationReference is a model to encapsulate all locations-based register data
  # (see Redaktionssystem: Location, Camp, Company, LocationName, PhysicalLocation...)
  # All this information is flattened into one table here.

  CITY_LEVEL = 0
  REGION_LEVEL = 1
  COUNTRY_LEVEL = 2

  belongs_to :interview

  delegate  :archive_id,
            :video,
            :translated,
            :to => :interview

  has_many  :location_segments,
            :dependent => :delete_all

  has_many  :segments,
            :through => :location_segments

  named_scope :forced_labor, { :conditions => "reference_type = 'forced_labor_location'" }
  named_scope :return, { :conditions => "reference_type = 'return_location'" }
  named_scope :deportation, { :conditions => "reference_type = 'deportation_location'" }

  named_scope :with_segments, { :joins => "LEFT JOIN location_segments ON location_segments.location_reference_id = location_references.id",
                                :conditions => "location_segments.id IS NOT NULL",
                                :group => "location_references.id" }

  named_scope :with_segments_from_interview, lambda {|i| {
                                :joins => "LEFT JOIN location_segments ON location_segments.location_reference_id = location_references.id",
                                :conditions => ["location_segments.id IS NOT NULL AND location_references.interview_id = ?",i.id],
                                :group => "location_references.id" }}

  validates_presence_of :name, :reference_type
  validates_uniqueness_of :name, :scope => [ :reference_type, :interview_id ]
  validates_associated  :interview

  before_save :accumulate_field_info

  after_save :update_interview_category

  searchable :auto_index => false do
    string :archive_id, :stored => true
    text :name, :boost => 12
    text :alias_names, :boost => 3
    text :location_name, :boost => 6
    text :alias_location_names
    string :location_type, :stored => true
    string :reference_type, :stored => true
    string :interviewee, :stored => true do
      self.interview.anonymous_title
    end
    string :language, :stored => true do
      self.interview.languages.to_s
    end
    string :interview_type, :stored => true do
      self.interview.video ? 'video' : 'audio'
    end
    string :experience_groups, :stored => true do
      self.interview.forced_labor_groups.map{|g| g.name }.join(", ")
    end
  end

  def json_attrs(include_hierarchy=false)
    json = {}
    return json if self.interview.nil?
    json['interviewId'] = self.interview.archive_id
    json['interviewee'] = self.interview.anonymous_title
    json['language'] = self.interview.languages.to_s
    json['translated'] = self.interview.translated
    json['interviewType'] = self.interview.video
    json['referenceType'] = self.reference_type
    unless include_hierarchy
      json['experienceGroup'] = self.interview.forced_labor_groups.map{|g| g.name }.join(", ")
    end
    json['location'] = name
    json['locationType'] = location_type
    json['longitude'] = exact_longitude
    json['latitude'] = exact_latitude
    if include_hierarchy
      json['country'] = {
              'name' => country_name,
              'latitude' => country_latitude,
              'longitude' => country_longitude
      }
      json['region'] = {
              'name' => region_name,
              'latitude' => region_latitude,
              'longitude' => region_longitude
      }
      json['country'].delete_if{|k,v| v.blank? }
      json['region'].delete_if{|k,v| v.blank?}
    end
    json
  end

  def short_name
    @short_name ||= '' + \
      begin
        built_name = []
        if classified
          # then we can just ignore the region (second name part) if given
          built_name = name.split(',').map{|p| p.strip}
          if built_name.size == 3
            built_name.delete_at(1)
          end
        else
          name.split(';').each do |location|
            parts = location.split(',').map{|p| p.strip}
            parts.each do |part|
              remove = false
              (parts - [part]).each do |other_part|
                if other_part.include?(part)
                  remove = true
                end
              end
              built_name << part unless remove
            end
          end
        end
      built_name.uniq.join(', ')
      end
  end

  # setter functions

  def camp_name=(name='')
    @camp_name = name
  end

  def company_name=(name='')
    @company_name = name
  end

  def additional_alias=(alias_names='')
    @additional_alias_names ||= []
    @additional_alias_names += (alias_names || '').split(/\s+?[;,]\s+?/)
  end

  def camp_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def company_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def camp_type=(category='')
    @camp_category = category
  end

  # currently there is no usage for the camp_classification anywhere
  # so this value isn't stored
  def camp_classification=(classification)
    @camp_classification = classification
  end

  def city_name=(alias_names='')
    @city_name = alias_names
    write_attribute :hierarchy_level, CITY_LEVEL
    self.additional_alias=@city_name
  end

  def city_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def region_name=(alias_names='')
    self.additional_alias=alias_names
    write_attribute :hierarchy_level, REGION_LEVEL unless self.hierarchy_level == CITY_LEVEL
    write_attribute :region_name, alias_names
  end

  def region_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def country_name=(alias_names='')
    self.additional_alias=alias_names
    write_attribute :hierarchy_level, COUNTRY_LEVEL if self.hierarchy_level.nil?
    write_attribute :country_name, alias_names
  end

  def country_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def alias_location_names=(data)
    result = case data
      when String
        data.strip
      when Array
        data.uniq.delete_if{|i| i.blank? }.join("; ")
    end
    write_attribute :alias_location_names, result
  end

  def workflow_state=(state)
    @workflow_state=state
  end

  def exact_latitude=(lat)
    @exact_latitude = lat
  end

  def exact_latitude
    @exact_latitude ||= read_attribute(:latitude)
  end

  def exact_longitude=(lon)
    @exact_longitude = lon
  end

  def exact_longitude
    @exact_longitude ||= read_attribute(:longitude)
  end

  def self.search(query={})
    Sunspot.search LocationReference do

      location = Search.lucene_escape(query[:location])

      if query[:page].blank?
        self.paginate :page => 1, :per_page => 800
      else
        self.paginate :page => query[:page].to_i, :per_page => 50
      end

      adjust_solr_params do |params|
        params[:defType] = 'lucene'

        # fulltext search
        unless location.blank?
          params[:q] = location
        end
      end

    end
  end

  private

  # Assign relevant conditional info from setter fields to DB columns
  def accumulate_field_info
    accumulation_fields = {
        :camp_name => :location_name,
        :company_name => :location_name,
        :exact_latitude => :latitude,
        :exact_longitude => :longitude,
        :camp_category => :place_subtype
    }
    accumulation_fields.each do |variable, field|
      if instance_eval "defined?(@#{variable}) && !@#{variable}.blank?"
        send("#{field}=", instance_eval("@#{variable}"))
      end
    end
    self.alias_location_names = ((self.alias_location_names || '').concat("; #{@additional_alias_names}"))\
      .split(/\s+?[;,]\s+?/).delete_if{|p| p.blank?}.join('; ')
    self.location_type = 'Location' if self.location_type.blank?
    self.classified = ((@workflow_state || '').strip == 'classified')
    true
  end

  # Creates a relevant interview field (forced labor locations etc)
  def update_interview_category
    case reference_type.to_s
      when 'place_of_birth'
        interview.update_attribute :birth_location, name
      when 'home_location'
        # set the home location on the interview
        interview.home_location = @country_name || name.split(',').last
    end
  end

end
