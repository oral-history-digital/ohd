class Contribution < ActiveRecord::Base

  # This class joins contributors and interviews, defining
  # a contribution to the Archive in a specific area (contribution_type)

  belongs_to :interview
  belongs_to :contributor

  validates_associated :interview, :contributor
  validates_presence_of :contribution_type
  validates_uniqueness_of :contributor_id, :scope => [ :interview_id, :contribution_type ]

  before_create :set_contributor

  def first_name=(name)
    @first_name = name
  end

  def first_name
    @first_name
  end

  def last_name=(name)
    @last_name = name
  end

  def last_name
    @last_name
  end

  private

  def set_contributor
    if self.contributor.nil?
      # Find or create the contributor
      self.contributor = Contributor.find_or_initialize_by_first_name_and_last_name first_name, last_name
      case contribution_type
        when 'transcript'
          self.contributor.transcription = true
        when 'proofreading'
          self.contributor.proof_reading = true
        when 'research'
          self.contributor.documentation = true
        else
          if self.contributor.respond_to?(contribution_type)
            self.contributor.send(contribution_type + '=', true)
          else
            self.contributor.other = true
          end
      end
      self.contributor.save if self.contributor.new_record? || self.contributor.changed?
    end
  end

end