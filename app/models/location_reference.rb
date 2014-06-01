require 'globalize'

class LocationReference < ActiveRecord::Base

  # LocationReference is a model to encapsulate all locations-based register data
  # (see Redaktionssystem: Location, Camp, Company, LocationName, PhysicalLocation...)
  # All this information is flattened into one table here.

  CITY_LEVEL = 0
  REGION_LEVEL = 1
  COUNTRY_LEVEL = 2

  belongs_to :interview,
             :include => :translations

  delegate  :archive_id,
            :video,
            :translated,
            :to => :interview

  has_many  :location_segments,
            :dependent => :delete_all

  has_many  :segments,
            :through => :location_segments

  translates :name, :location_name, :region_name, :country_name

  named_scope :forced_labor, { :conditions => "reference_type = 'forced_labor_location'" }
  named_scope :return, { :conditions => "reference_type = 'return_location'" }
  named_scope :deportation, { :conditions => "reference_type = 'deportation_location'" }

  named_scope :with_segments, { :joins => 'LEFT JOIN location_segments ON location_segments.location_reference_id = location_references.id',
                                :conditions => 'location_segments.id IS NOT NULL',
                                :group => 'location_references.id' }

  named_scope :with_segments_from_interview, lambda {|i| {
                                :joins => 'LEFT JOIN location_segments ON location_segments.location_reference_id = location_references.id',
                                :conditions => ['location_segments.id IS NOT NULL AND location_references.interview_id = ?',i.id],
                                :group => 'location_references.id' }}

  validates_presence_of :reference_type
  validates_associated  :interview

  validate :name_must_be_unique_within_locale_and_reference_type
  def name_must_be_unique_within_locale_and_reference_type
    # The globalize2 stash contains new translations that
    # will be written on save. These must be validated.
    self.globalize.stash.each do |locale, translation|
      name = translation[:name]
      unless name.blank?
        existing = self.class.count(
            :joins => :translations,
            :conditions => {
                :interview_id => self.interview_id,
                :reference_type => self.reference_type,
                'location_reference_translations.locale' => locale.to_s,
                'location_reference_translations.name' => name
            }
        )
        errors.add(:name, " '#{name}' must be unique within locale and reference type") if existing > 0
      end
    end
  end

  validate :has_standard_name
  def has_standard_name
    if self.name(I18n.default_locale).blank?
      errors.add(:name, ' must be set for default locale (=standard name).')
    end
  end

  before_save :accumulate_field_info

  after_save :update_interview_category

  searchable :auto_index => false do
    text :name, :boost => 12 do
      name = ''
      translations.each do |translation|
        name << ' ' + translation.name unless translation.name.blank?
      end
      name.strip
    end
    text :alias_names, :boost => 3
    text :location_name, :boost => 6 do
      location_name = ''
      translations.each do |translation|
        location_name << ' ' + translation.location_name unless translation.location_name.blank?
      end
      location_name.strip
    end
    text :alias_location_names
  end

  def json_attrs(include_hierarchy=false)
    json = {}
    return json if self.interview.nil?
    json['interviewId'] = self.interview.archive_id
    json['interviewee'] = self.interview.anonymous_title(I18n.locale)
    json['language'] = self.interview.languages.join('/')
    json['translated'] = self.interview.translated
    json['interviewType'] = self.interview.video
    json['referenceType'] = self.reference_type
    unless include_hierarchy
      json['experienceGroup'] = self.interview.forced_labor_groups.join(', ')
    end
    json['location'] = name(I18n.locale)
    json['locationType'] = location_type
    json['longitude'] = exact_longitude
    json['latitude'] = exact_latitude
    if include_hierarchy
      json['country'] = {
              'name' => country_name(I18n.locale),
              'latitude' => country_latitude,
              'longitude' => country_longitude
      }
      json['region'] = {
              'name' => region_name(I18n.locale),
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

  def camp_name=(name='', locale = I18n.default_locale)
    @camp_name ||= {}
    @camp_name[locale] = name
  end

  def company_name=(name='', locale = I18n.default_locale)
    @company_name ||= {}
    @company_name[locale] = name
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

  def city_name=(alias_names='', locale = I18n.default_locale)
    write_attribute :hierarchy_level, CITY_LEVEL
    self.additional_alias=alias_names
  end

  def city_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def region_name=(alias_names='')
    self.additional_alias=alias_names
    write_attribute :hierarchy_level, REGION_LEVEL unless self.hierarchy_level == CITY_LEVEL
    globalize.write(self.class.locale || I18n.default_locale, :region_name, alias_names)
  end

  def region_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def country_name=(alias_names='')
    self.additional_alias=alias_names
    write_attribute :hierarchy_level, COUNTRY_LEVEL if self.hierarchy_level.nil?
    globalize.write(self.class.locale || I18n.default_locale, :country_name, alias_names)
  end

  def country_alias_names=(alias_names='')
    self.additional_alias=alias_names
  end

  def alias_location_names=(data)
    raise unless data.is_a? Array
    write_attribute :alias_location_names, data.uniq.delete_if{|i| i.blank? }.join('; ')
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

      keywords query[:location]

      if query[:page].blank?
        self.paginate :page => 1, :per_page => 800
      else
        self.paginate :page => query[:page].to_i, :per_page => 50
      end

      adjust_solr_params do |params|
        params[:defType] = 'edismax'
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
      next if instance_eval "!defined?(@#{variable}) or @#{variable}.blank?"
      if instance_eval "@#{variable}.is_a? Hash"
        # translated field
        instance_eval("@#{variable}").each do |locale, translation|
          LocationReference.with_locale(locale) do
            send("#{field}=", translation)
          end
        end
      else
        # not translated
        send("#{field}=", instance_eval("@#{variable}"))
      end
    end
    self.alias_location_names = (@additional_alias_names || [])
    self.location_type = 'Location' if self.location_type.blank?
    self.classified = ((@workflow_state || '').strip == 'classified')
    true
  end

  # Creates a relevant interview field (forced labor locations etc)
  def update_interview_category
    return unless ['place_of_birth', 'home_location'].include? reference_type.to_s
    translations.each do |t|
      locale = t.locale.to_sym
      Interview.with_locale(locale) do
        case reference_type.to_s
          when 'place_of_birth'
            interview.birth_location = name(locale)
          when 'home_location'
            # Set the home location on the interview.
            interview.home_location = country_name(locale) || name(locale).split(',').last
        end
      end
    end
    interview.save!
  end

end
