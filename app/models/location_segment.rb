class LocationSegment < ActiveRecord::Base

  # LocationSegment joins LocationReference information to particular
  # interview segments

  belongs_to :location_reference, :include => :translations
  belongs_to :segment
  belongs_to :interview

  validates_associated :location_reference
  validates_associated :segment

  validates_presence_of :segment_id
  validates_presence_of :location_reference_id

  validates_uniqueness_of :location_reference_id, :scope => [ :segment_id ]

  def before_validation_on_create
    self.location_reference = LocationReference.first(
        :joins => 'INNER JOIN location_reference_translations lrt ON location_references.id = lrt.location_reference_id AND lrt.locale = "de"',
        :conditions => ['lrt.name = ? AND location_references.interview_id = ?', @descriptor, self.interview_id]
    )
    self.location_reference_id = location_reference.id unless location_reference.nil?
    self.segment = Segment.first(:conditions => ["NOT (media_id > ?) AND media_id LIKE ?", @media_id, "#{@media_id[Regexp.new("^#{CeDiS.config.project_initials}\\d{3}_\\d{2}_\\d{2}", Regexp::IGNORECASE)]}%"], :order => "timecode DESC")
    self.segment_id = segment.id unless segment.nil?
  end

  def descriptor=(name)
    @descriptor = name
  end

  def media_id=(id_string)
    if id_string =~ Regexp.new("^#{CeDiS.config.project_initials}\\d{3}_\\d{2}_\\d{2}_\\d{4}", Regexp::IGNORECASE)
      @media_id = id_string
    else
      raise "Assigning illegal media_id = '#{id_string}'"
    end
  end

end
