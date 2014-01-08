class Contribution < ActiveRecord::Base

  # This class joins contributors and interviews, defining
  # a contribution to the Archive in a specific area (contribution_type)

  belongs_to :interview
  belongs_to :contributor, :include => :translations

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
      self.contributor = Contributor.first(
        :joins => :translations,
        :conditions => [
            'contributor_translations.first_name = ? AND contributor_translations.last_name = ? AND contributor_translations.locale = ?',
            first_name, last_name, I18n.default_locale.to_s
        ],
        :readonly => false
      )
      self.contributor ||= Contributor.new(
          :first_name => first_name,
          :last_name => last_name
      )
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
      self.contributor.save!
    end
  end

end
