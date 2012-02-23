class LocationReference < ActiveRecord::Base

  # LocationReference is a model to encapsulate all locations-based register data
  # (see Redaktionssystem: Location, Camp, Company, LocationName, PhysicalLocation...)
  # All this information is flattened into one table here.

  # TODO: enforce singular location names and separate location names (at least per interview)
  # from references in different categories (birth, deportation etc). Or store the categories
  # in a struct or individual flags, so that multiple are possible. Otherwise location_segments
  # will only be related to a single category, each.

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
    string :quadrant
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
    json['interviewId'] = self.interview.archive_id
    json['interviewee'] = self.interview.anonymous_title
    json['language'] = self.interview.languages.to_s
    json['translated'] = self.interview.translated
    json['interviewType'] = self.interview.video ? 'video' : 'audio'
    json['referenceType'] = self.reference_type
    json['experienceGroup'] = self.interview.forced_labor_groups.map{|g| g.name }.join(", ")
    json['location'] = name
    json['locationType'] = location_type
    json['longitude'] = longitude
    json['latitude'] = latitude
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
  def camp_type=(category='')
    @camp_category = category
  end

  def camp_name=(name='')
    @camp_name = name
  end

  def company_name=(name='')
    @company_name = name
  end

  def add_main_alias=(alias_names='')
    @main_aliases ||= []
    @main_aliases += (alias_names || '').split(/\s+?[;,]\s+?/)
  end

  def additional_alias=(alias_names='')
    @additional_alias_names ||= []
    @additional_alias_names += (alias_names || '').split(/\s+?[;,]\s+?/)
  end

  def camp_alias_names=(alias_names='')
    self.add_main_alias=alias_names
  end

  def company_alias_names=(alias_names='')
    self.add_main_alias=alias_names
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


  # returns approximated "flat" grid coordinates as distance from Berlin
  def coordinates
    coord = LocationReference.coordinates_for(latitude, longitude)
    return coord if coord.first.nil?
    [LocationReference.null_coordinates.first + coord.first, LocationReference.null_coordinates.last + coord.last]
  end

  def self.null_coordinates
    @@reference_coord ||= LocationReference.coordinates_for('90','180') # wrap west of Alaska and north of Polar circle
  end

  def self.coordinates_for(lat, lon)
    begin
      y = 110.6 * lat.to_f
      x = 75 * lon.to_f
#      # scale latitude distance by latitude spline approximation
#      s_scales = [[0, 111.3], [30, 96.39], [45, 78.7], [51.4795, 69.29], [60, 55.65], [90, 48]]
#      y_prev = 0
#      prev_scale = 111.3
#      y = 0
#      lati = lat.to_f.abs
#      s_scales.each do |l|
#        if l.first > lati
#          scale =  ((lati - y_prev) / (l.first - y_prev) * l.last) + ((l.first - lati) / (l.first - y_prev) * prev_scale)
#          y += scale * (lati - y_prev)
#        end
#        y_prev = l.first
#        prev_scale = l.last
#      end
#      y = y * (lat.to_f / lat.to_f.abs)
      [y.round, x.round] # lat, lng
    rescue FloatDomainError
      [ nil, nil ]
    end
  end

  def grid_x
    @grid_coord ||= grid_coordinates
    @grid_coord.last
  end

  def grid_y
    @grid_coord ||= grid_coordinates
    @grid_coord.first
  end

  def quadrant
    @grid_coord ||= grid_coordinates
    (@grid_coord.first || '-').to_s + '=' + (@grid_coord.last || '-').to_s
  end

  def grid_coordinates
    coord = coordinates
    return [ nil, nil ] if coord.first.nil?
    @grid_coord = []
    coord.each do |distance|
      @grid_coord << LocationReference.distance_to_grid_coordinate(distance)
    end
    @grid_coord
  end

  # sorting algorithm for grid coordinates
  GRID_SORT = lambda do |a,b|
    # first the numerical part
    order = a.to_s[/\d+$/].to_i <=> b.to_s[/\d+$/].to_i
    # next the alphabetical part
    order = a.to_s[/^\w+/] <=> b.to_s[/^\w+/] if order == 0
    order
  end

  def self.grid_encode(units)
    while(units > 26 * 26) do
      units = units - 26 * 26
    end
    ('A'..'Z').to_a[(units / 26).floor] + ('A'..'Z').to_a[units % 26]
  end

  def self.grid_decode(gridcode)
    tokens = gridcode.scan(/\w{1}/)
    value = 0
    scale = 1
    while !tokens.empty?
      alpha = tokens.pop
      value += ('A'..'Z').to_a.index(alpha) * scale
      scale = scale * 26
    end
    value
  end

  def self.distance_to_grid_coordinate(distance)
    return nil if distance.nil?
    grid_units = (distance.abs / 1000).round # 250 km per grid unit
    # puts "GridIndices for distance = #{distance}: #{grid_units / 26}:#{(grid_units2 / 10).round}:#{grid_units2 % 10}"
    LocationReference.grid_encode(grid_units)
  end

  def self.grid_diff_coordinate(coordinate, diff)
    coordinate = coordinate.to_s
    nil unless coordinate =~ /^[A-Z]+$/
    value = LocationReference.grid_decode(coordinate)
    LocationReference.grid_encode(value + diff)
=begin

    alpha = ('A'..'Z').to_a.index coordinate[/^\w/]
    numeric = coordinate[/\d+$/].to_i
    alpha_diff = diff.abs  % 26
    numeric_diff = (diff.abs / 26).truncate * (diff == 0 ? 1 : (diff / diff.abs))
    alpha = alpha + (diff == 0 ? 1 : (diff / diff.abs)) * alpha_diff
    while (alpha < 0)
      alpha += 26
      numeric_diff -= 1
    end
    while (alpha > 25)
      alpha -= 26
      numeric_diff += 1
    end
    ('A'..'Z').to_a[alpha] + (0..99).to_a[(numeric + numeric_diff)].to_s.rjust(2,'0')
=end
  end

  # yields a raster of quadrants around a grid coordinate pair
  def self.surrounding_quadrant_raster_for(coordinates)
    raster = []
    x = coordinates.first
    y = coordinates.last
    # 5 x 5 raster centered on the coordinate
    (-2..2).each do |diff_x|
      (-2..2).each do |diff_y|
        # skip border coordinates
        next if diff_x.abs == 2 && diff_x.abs == diff_y.abs
        rx = x.nil? ? nil : LocationReference.grid_diff_coordinate(x, diff_x)
        ry = y.nil? ? nil : LocationReference.grid_diff_coordinate(y, diff_y)
        raster << (rx || '???').to_s + '=' + (ry || '???').to_s
      end
    end
    raster
  end

  # yields a raster of quadrants for a bounding set of coordinate pairs
  def self.bounding_quadrant_raster_for(coord1, coord2)
    raster = []
    x_limits = [ coord2.first, coord1.first ].sort # don't sort like this: .sort{|a,b| LocationReference::GRID_SORT.call(a,b)}
    y_limits = [ coord2.last, coord1.last ].sort # don't sort like this: .sort{|a,b| LocationReference::GRID_SORT.call(a,b)}
    puts "\n@@@ X_LIMITS: #{x_limits.inspect}\n Y_LIMITS: #{y_limits.inspect}"
    x = x_limits.first #LocationReference.grid_diff_coordinate(x_limits.first, -1)
    while x <=  LocationReference.grid_diff_coordinate(x_limits.last, 1)
      y = y_limits.first #LocationReference.grid_diff_coordinate(y_limits.first, -1)
      while y <=  LocationReference.grid_diff_coordinate(y_limits.last, 1)
        raster << (x || '???').to_s + '=' + (y || '???').to_s
        y = LocationReference.grid_diff_coordinate(y, 1)
      end
      x = LocationReference.grid_diff_coordinate(x, 1)
    end
    puts "\n@@@ Location Query in raster:\n#{raster.inspect}\n@@@"
    raster
  end

  def self.search(query={})
    Sunspot.search LocationReference do

      location = Search.lucene_escape(query[:location])

      lon = query[:longitude].nil? ? nil : query[:longitude].to_f
      lat = query[:latitude].nil? ? nil : query[:latitude].to_f

      lon2 = query[:longitude2].nil? ? nil : query[:longitude2].to_f
      lat2 = query[:latitude2].nil? ? nil : query[:latitude2].to_f

      raster = []
      unless lon.nil? && lat.nil?
        raster = if lon2.nil? || lat2.nil?
          loc = LocationReference.new{|l| l.latitude = lat; l.longitude = lon }
          LocationReference.surrounding_quadrant_raster_for(loc.grid_coordinates)
        else
          loc1 = LocationReference.new{|l| l.latitude = lat; l.longitude = lon }
          loc2 = LocationReference.new{|l| l.latitude = lat2; l.longitude = lon2 }
          LocationReference.bounding_quadrant_raster_for(loc1.grid_coordinates, loc2.grid_coordinates)
        end
      end

      unless raster.empty?
        # puts "\n@@@ Location Query in raster:\n#{raster.inspect}\n@@@"
        self.with(:quadrant).any_of(raster)
      end

      unless query[:page].blank?
        self.paginate :page => query[:page].to_i, :per_page => 50
      else
        self.paginate :page => 1, :per_page => 800
      end

      adjust_solr_params do |params|
        params[:defType] = 'lucene'
        #params[:qt] = 'standard'

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
        :camp_category => :location_type,
        :camp_name => :location_name,
        :additional_alias_names => :alias_location_names
    }
    accumulation_fields.each do |variable, field|
      if instance_eval "defined?(@#{variable}) && !@#{variable}.blank?"
        send("#{field}=",instance_eval("@#{variable}"))
      end
    end
    self.classified = ((@workflow_state || '').strip == 'classified')
    true
  end

  # Creates a relevant interview field (forced labor locations etc)
  def update_interview_category
    attr = []
    case reference_type.to_s
      when 'place_of_birth'
        interview.update_attribute :birth_location, name
      when 'home_location'
        # set the home location on the interview
        interview.home_location = @country_name || name.split(',').last
    end
  end

end