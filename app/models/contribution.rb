class Contribution < ActiveRecord::Base

  # This class joins contributors and interviews, defining
  # a contribution to the Archive in a specific area (contribution_type)

  belongs_to :interview
  belongs_to :contributor, 
    -> { includes(:translations) },
    # the following line should  be added  after the migration move_contributors_to_people
    class_name: 'Person'

  validates_associated :interview, :contributor
  validates_presence_of :contribution_type
  validates :contribution_type, inclusion: %w(interview interviewee proof_reading research segmentation transcript translation)
  validates_uniqueness_of :contributor_id, :scope => [ :interview_id, :contribution_type ]

  #before_create :update_contributor

  #def initialize(attributes = nil)
    #@name ||= {}
    #super(attributes)
  #end

  #def first_name=(name, locale = I18n.default_locale)
    #raise unless locale.is_a? Symbol
    #@name[locale] ||= {}
    #@name[locale][:first_name] = name
  #end

  #def first_name(locale = I18n.default_locale)
    #raise unless locale.is_a? Symbol
    #return nil unless @name[locale]
    #@name[locale][:first_name]
  #end

  #def last_name=(name, locale = I18n.default_locale)
    #raise unless locale.is_a? Symbol
    #@name[locale] ||= {}
    #@name[locale][:last_name] = name
  #end

  #def last_name(locale = I18n.default_locale)
    #raise unless locale.is_a? Symbol
    #return nil unless @name[locale]
    #@name[locale][:last_name]
  #end

  #private

  #def update_contributor
    ## Try to find an existing contributor by standard name.
    #if self.contributor.nil?
      #self.contributor = Contributor.joins(:translations).
        #where([
            #'contributor_translations.first_name = ? AND contributor_translations.last_name = ? AND contributor_translations.locale = ?',
            #@name[:de][:first_name], @name[:de][:last_name], 'de'
        #]).first
    #end
    ## If no existing contributor was found then create a new one.
    #self.contributor ||= self.build_contributor
    ## Update translated names.
    #@name.each do |locale, name_translation|
      #Contributor.with_locale(locale) do
        #self.contributor.first_name = name_translation[:first_name]
        #self.contributor.last_name = name_translation[:last_name]
      #end
    #end
    #case contribution_type
      #when 'transcript'
        #self.contributor.transcription = true
      #when 'proofreading'
        #self.contributor.proof_reading = true
      #when 'research'
        #self.contributor.documentation = true
      #else
        #if self.contributor.respond_to?(contribution_type)
          #self.contributor.send("#{contribution_type}=", true)
        #else
          #self.contributor.other = true
        #end
    #end
    #self.contributor.save!
    #self.contributor_id = self.contributor.id
  #end

end
