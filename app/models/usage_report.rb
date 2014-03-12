class UsageReport < ActiveRecord::Base

  belongs_to :user_account

  LOGIN_ACTION = 'SessionsController#create'

  TRACKED_ACTIONS = [
      LOGIN_ACTION,
      'InterviewsController#show',
      'SearchesController#query',
      'LocationReferencesController#map_frame'
  ]

  validates_presence_of :logged_at
  validates_presence_of :action
  validates_inclusion_of :action, :in => TRACKED_ACTIONS

  named_scope :logged_in_month, lambda{|date| {:conditions => {:logged_at => date.beginning_of_month..date.end_of_month}}}
  named_scope :logins, {:conditions => {:action => LOGIN_ACTION}}

  def validate
    case action
      when LOGIN_ACTION
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

  def self.create_logins_report(date)
    require 'net/http'
    require 'uri'
    geolocation_base = 'http://freegeoip.net/csv'
    resolved_ips = {}
    login_reports = UsageReport.logged_in_month(date).logins.scoped({:include => :user_account})
    timeframes = [:total,0..999,0..1,1..2,2..3,4..6,6..12,12..999]
    logins = {:total => 0, :users => []}
    logins_per_country = {nil => {:total => 0, :users => []}}
    timeframes.each{|t| logins[t] = 0}
    login_reports.each do |r|
      logins[:total] += 1

      # check user country or IP geolocation
      # add to country row and specific_range column
      # use freegeoip.net/csv/{ip} - "ip","DE","Germany"
      country = nil
      if r.user_account && r.user_account.user
        country = r.user_account.user.country.upcase
      else
        if resolved_ips.keys.include?(r.ip)
          country = resolved_ips[r.ip]
        else
          geolocation = URI.parse([geolocation_base, r.ip].join('/'))
          res = Net::HTTP.get_response(geolocation)
          if(res.is_a?(Net::HTTPSuccess))
            response = (res.body || '').split(',')
            if response.is_a?(Array) && response.first == r.ip
              country = response[1]
              resolved_ips[r.ip] = country
            end
          end
        end
      end
      logins_per_country[country] ||= {:total => 0, :users => []}
      logins_per_country[country][:total] += 1

      # data per timeframe columns
      if r.user_account
        time = (r.logged_at - (r.user_account.confirmed_at || r.user_account.confirmation_sent_at)) / 1.month
        timeframes.each do |range|
          next unless range.is_a?(Range)
          if time >= range.first && time < range.last
            logins[range] += 1
            logins_per_country[country][range] ||= 0
            logins_per_country[country][range] += 1
          end
        end
        # add unique users
        unless logins[:users].include?(r.user_account_id)
          logins[:users] << r.user_account_id
        end
        unless logins_per_country[country][:users].include?(r.user_account_id)
          logins_per_country[country][:users] << r.user_account_id
        end
      end

    end
    sorted_countries = []
    logins_per_country.keys.compact.each do |country|
      sorted_countries << [country, logins_per_country[country][:total]]
    end
    sorted_countries.sort!{|a,b| b.last <=> a.last }

    puts "Logins per Country (#{resolved_ips.keys.size} geolocation calls)"
    puts (['Ctry  ', 'unique '.rjust(6)] + timeframes.map{|r| r.to_s.rjust(6,' ')}).join("|")
    puts (['all   ', logins[:users].size.to_s.rjust(6)] + timeframes.map{|r| logins[r].to_s.rjust(6,' ')}).join("|")
    ([[nil, 0]] + sorted_countries).each do |entry|
      country = entry.first
      puts ([(country || '?').ljust(6,' '), logins_per_country[country][:users].size.to_s.rjust(6)] + timeframes.map{|r|
        (logins_per_country[country][r] || 0).to_s.rjust(6,' ')
      }).join("|")
    end


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
