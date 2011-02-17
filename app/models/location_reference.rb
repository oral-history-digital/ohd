class LocationReference < ActiveRecord::Base

  belongs_to :interview

  delegate  :archive_id,
            :video,
            :translated,
            :to => :interview

  validates_uniqueness_of :name, :scope => :interview_id


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
    @@reference_coord ||= LocationReference.coordinates_for('52.5186','13.408')
    [coord.first - @@reference_coord.last, coord.last - @@reference_coord.last]
  end

  def self.coordinates_for(lat, lon)
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
  end

end