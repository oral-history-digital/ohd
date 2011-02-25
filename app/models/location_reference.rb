class LocationReference < ActiveRecord::Base

  belongs_to :interview

  delegate  :archive_id,
            :video,
            :translated,
            :to => :interview

  validates_uniqueness_of :name, :scope => :interview_id

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

  def json_attrs
    json = {}
    json['interviewId'] = self.interview.archive_id
    json['interviewee'] = self.interview.anonymous_title
    json['language'] = self.interview.languages.to_s
    json['translated'] = self.interview.translated
    json['interviewType'] = self.interview.video ? 'video' : 'audio'
    json['experienceGroup'] = self.interview.forced_labor_groups.map{|g| g.name }.join(", ")
    json['location'] = name
    json['locationType'] = location_type
    json['longitude'] = longitude
    json['latitude'] = latitude
    json
  end

  # returns approximated "flat" grid coordinates as distance from Berlin
  def coordinates
    coord = LocationReference.coordinates_for(latitude, longitude)
    return coord if coord.first.nil?
    @@reference_coord ||= LocationReference.coordinates_for('52.5186','13.408')
    [coord.first - @@reference_coord.last, coord.last - @@reference_coord.last]
  end

  def self.coordinates_for(lat, lon)
    begin
      y = 110.6 * lat.to_f
      # scale latitude distance by latitude spline approximation
      s_scales = [[30, 96.39], [45, 78.7], [51.4795, 69.29], [60, 55.65]]
      x_prev = 0
      prev_scale = 111.3
      x = 0
      long = lon.to_f.abs
      s_scales.each do |l|
        if l.first > long
          scale =  ((long - x_prev) / (l.first - x_prev) * l.last) + ((l.first - long) / (l.first - x_prev) * prev_scale)
          x += scale * (long - x_prev)
        end
      end
      x = x * (lon.to_f / lon.to_f.abs)
      [x.round, y.round]
    rescue FloatDomainError
      [ nil, nil ]
    end
  end

  def grid_x
    @grid_coord ||= grid_coordinates
    @grid_coord.first
  end

  def grid_y
    @grid_coord ||= grid_coordinates
    @grid_coord.last
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

  def self.distance_to_grid_coordinate(distance)
    return nil if distance.nil?
    grid_units = (distance / 25).round # 25 km per grid unit
    ('A'..'Z').to_a[grid_units % 26] + (0..99).to_a[(grid_units / 26).to_i].to_s.rjust(2,'0')
  end

  def self.grid_diff_coordinate(coordinate, diff)
    nil unless coordinate =~ /^[A-Z][0-9]{2}$/
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

  def self.search(query={})
    Sunspot.search LocationReference do

      location = Search.lucene_escape(query[:location])

      lon = query[:longitude]
      lat = query[:latitude]
      raster = []
      unless lon.nil? && lat.nil?
        loc = LocationReference.new{|l| l.latitude = lat || 0.0; l.longitude = lon || 0.0 }
        raster = LocationReference.surrounding_quadrant_raster_for(loc.grid_coordinates)
      end

      unless raster.empty?
        self.with(:quadrant).any_of(raster)
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

end