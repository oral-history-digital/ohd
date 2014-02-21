class UsageReport < ActiveRecord::Base

  belongs_to :user_account

  TRACKED_ACTIONS = [
      'SessionsController#create',
      'InterviewsController#show',
      'SearchesController#query',
      'LocationReferencesController#map_frame'
  ]

  validates_presence_of :logged_at
  validates_presence_of :action
  validates_inclusion_of :action, :in => TRACKED_ACTIONS

  def validate
    case action
      when 'SessionsController#create'
        validate_user_account
      when 'InterviewsController#show'
        validate_archive_id
      when 'InterviewsController#text_materials'
        validate_archive_id
        unless facets.match(/^za\d{3}_\w{2,4}/i)
          errors.add_to_base('Incorrect or missing filename parameter for text materials request')
        end
      when 'SearchesController#query'
        # validate_user_account
      when 'LocationReferencesController#map_frame'
        # nothing
      else
        # nothing - should not be valid
    end
  end


  def verb=(verb)
    @verb = verb
  end

  def parameters=(params)
    @parameters = (params || {}).symbolize_keys
    case action
      when 'SessionsController#create'
        # use login for later assignment of user_account
        @login = @parameters[:user_account]['login']
      when 'InterviewsController#show'
        self.resource_id = @parameters[:id]
      when 'InterviewsController#text_materials'
        self.resource_id = @parameters[:id]
        self.facets = [@parameters[:filename], @parameters[:extension]].compact.join('.')
      when 'SearchesController#query'
        unless @parameters[:suche].blank?
          query_params = Search.decode_parameters @parameters[:suche]
          self.query = query_params.delete(:fulltext)
          self.facets = query_params
        end
      else
    end
  end

  def login
    @login
  end

  # Returns an array of datetime representing the start of months that are covered by reports
  def self.months_covered
    [ UsageReport.first(:order => "logged_at ASC", :conditions => "logged_at LIKE '%-01 %'").logged_at,
      (UsageReport.last(:order => "logged_at ASC", :conditions => "logged_at LIKE '%-01 %'").logged_at - 1.month)
    ]
  end

  protected

  def validate_user_account
    if user_account_id.nil?
      if !login.blank?
        # this happens only on 'SessionController#create' actions,
        # but there is no need to check for that here
        # NOTE: theoretically, it is possible that someone attempts
        # a login with another accounts login details. Also, this
        # method cannot discern unsuccessful login attempts.
        user_account = UserAccount.find_by_login(login)
        unless user_account.nil?
          self.user_account_id = user_account.id
          UserAccountIP.create({ :user_account_id => user_account.id, :ip => self.ip })
        else
          errors.add(:user_account_id, :missing)
        end
      else
        errors.add(:user_account_id, :missing)
      end
    end
  end

  def validate_archive_id
    unless resource_id.match(/za\d{3}/i)
      errors.add(:resource_id, :invalid)
    end
  end

end
