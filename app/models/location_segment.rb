class LocationSegment < ActiveRecord::Base

  # LocationSegment joins LocationReference information to particular
  # interview segments

  belongs_to :location_reference
  belongs_to :segment
  belongs_to :interview

  validates_associated :location_reference
  validates_associated :segment

  validates_presence_of :segment_id
  validates_presence_of :location_reference_id

  validates_uniqueness_of :location_reference_id, :scope => [ :segment_id ]

  def before_validation_on_create
    self.location_reference = LocationReference.find_by_name_and_interview_id(@descriptor, self.interview_id)
    self.location_reference_id = location_reference.id unless location_reference.nil?
    self.segment = Segment.first(:conditions => ["NOT (media_id > ?) AND media_id LIKE ?", @media_id, "#{@media_id[/^za\d{3}_\d{2}_\d{2}/i]}%"], :order => "timecode DESC")
    self.segment_id = segment.id unless segment.nil?
  end

  def descriptor=(name)
    @descriptor = name
  end

  def media_id=(id_string)
    if id_string =~ /^ZA\d{3}_\d{2}_\d{2}_\d{4}/i
      @media_id = id_string
    else
      raise "Assigning illegal media_id = '#{id_string}'"
    end
  end

end
