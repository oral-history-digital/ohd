class LocationReference < ActiveRecord::Base

  belongs_to :interview

  delegate  :archive_id,
            :video,
            :translated,
            :to => :interview


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

end