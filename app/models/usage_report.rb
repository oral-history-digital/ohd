class UsageReport < ActiveRecord::Base

  belongs_to :user_account

  LOGIN = 'SessionsController#create'
  INTERVIEW = 'InterviewsController#show'
  MATERIALS = 'InterviewsController#text_materials'
  SEARCHES = 'SearchesController#query'
  MAP = 'LocationReferencesController#map_frame'

  TRACKED_ACTIONS = [
      LOGIN,
      INTERVIEW,
      MATERIALS,
      SEARCHES,
      MAP
  ]

  validates_presence_of :logged_at
  validates_presence_of :action
  validates_inclusion_of :action, :in => TRACKED_ACTIONS

  named_scope :logged_in_month, lambda{|date| {:conditions => {:logged_at => date.beginning_of_month..date.end_of_month}}}
  named_scope :logins, {:conditions => {:action => LOGIN}}
  named_scope :interviews, {:conditions => {:action => [INTERVIEW, MATERIALS]}}
  named_scope :searches, {:conditions => {:action => SEARCHES}}

  def validate
    case action
      when LOGIN
        validate_user_account
      when INTERVIEW
        validate_archive_id
      when MATERIALS
        validate_archive_id
        unless facets.match(/^za\d{3}_\w{2,4}/i)
          errors.add_to_base('Incorrect or missing filename parameter for text materials request')
        end
      when SEARCHES
        # validate_user_account
      when MAP
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

  def facets
    @facets ||= (YAML.load(read_attribute(:facets) || '') || {})
  end

  # resolve country from user data or geolocation
  def country
    require 'net/http'
    require 'uri'
    @@geolocation_base ||= 'http://freegeoip.net/csv'
    @@resolved_ips ||= {}
    # check user country or IP geolocation
    # add to country row and specific_range column
    # use freegeoip.net/csv/{ip} - "ip","DE","Germany"
    country = nil
    if self.user_account && self.user_account.user
      country = self.user_account.user.country.upcase
    else
      if @@resolved_ips.keys.include?(self.ip)
        country = @@resolved_ips[self.ip]
      else
        geolocation = URI.parse([@@geolocation_base, self.ip].join('/'))
        res = Net::HTTP.get_response(geolocation)
        if(res.is_a?(Net::HTTPSuccess))
          response = (res.body || '').split(',').map{|p| p.gsub('"','').strip}
          if response.is_a?(Array) && response.first == self.ip
            country = response[1]
            @@resolved_ips[self.ip] = country
          end
        end
      end
    end
    country
  end

  # Returns an array of datetime representing the start of months that are covered by reports
  def self.months_covered
    [ UsageReport.first(:order => "logged_at ASC", :conditions => "logged_at LIKE '%-01 %'").logged_at,
      (UsageReport.last(:order => "logged_at ASC", :conditions => "logged_at LIKE '%-01 %'").logged_at - 1.month)
    ]
  end

  def self.create_logins_report(date)
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
      country = r.country
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

    puts "Logins per Country:"
    puts (['Ctry  ', 'unique '.rjust(6)] + timeframes.map{|r| r.to_s.rjust(6,' ')}).join("|")
    puts (['all   ', logins[:users].size.to_s.rjust(6)] + timeframes.map{|r| logins[r].to_s.rjust(6,' ')}).join("|")
    ([[nil, 0]] + sorted_countries).each do |entry|
      country = entry.first
      puts ([(country || '?').ljust(6,' '), logins_per_country[country][:users].size.to_s.rjust(6)] + timeframes.map{|r|
        (logins_per_country[country][r] || 0).to_s.rjust(6,' ')
      }).join("|")
    end
  end

  def self.create_interview_access_report(date)
    reports = UsageReport.logged_in_month(date).interviews.scoped({:include => :user_account})
    interview_access = {:total => {}, :users => []}
    countries = {}
    resources = {}
    archive_ids = {}
    reports.each do |report|
      archive_id = report.resource_id
      archive_ids[archive_id] ||= 0
      archive_ids[archive_id] += 1
      country = report.country
      countries[country] ||= 0
      countries[country] += 1
      resource = report.facets.blank? ? 'Interview' : report.facets.downcase.sub("#{archive_id}_",'')
      resources[resource] ||= 0
      resources[resource] += 1
      interview_access[:total][:any] ||= 0
      interview_access[:total][:any] += 1
      interview_access[:total][country] ||= 0
      interview_access[:total][country] += 1
      interview_access[:total][resource] ||= 0
      interview_access[:total][resource] += 1
      interview_access[archive_id] ||= {:total => 0}
      interview_access[archive_id][:total] += 1
      interview_access[archive_id][country] ||= 0
      interview_access[archive_id][country] += 1
      interview_access[archive_id][resource] ||= 0
      interview_access[archive_id][resource] += 1
      interview_access[archive_id][:users] ||= []
      unless report.user_account_id.blank?
        unless interview_access[:users].include?(report.user_account_id)
          interview_access[:users] << report.user_account_id
        end
        unless interview_access[archive_id][:users].include?(report.user_account_id)
          interview_access[archive_id][:users] << report.user_account_id
        end
      end
    end
    sorted_archive_ids = archive_ids.to_a.sort{|a,b| b.last <=> a.last }.map{|i| i.first}
    sorted_countries = countries.to_a.sort{|a,b| b.last <=> a.last }.map{|c| c.first}
    sorted_resources = resources.to_a.sort{|a,b| b.last <=> a.last }.map{|r| r.first}
    data = []
    row = %w(Archiv-ID Zugriffe Nutzer) + sorted_resources + sorted_countries
    data << row
    ([:any] + sorted_archive_ids).each do |id|
      row = []
      record = case id
                 when :any
                   row << 'Alle'
                   row << interview_access[:total][:any]
                   row << interview_access[:users].size
                   interview_access[:total]
                 else
                   row << id
                   row << interview_access[id][:total]
                   row << interview_access[id][:users].size
                   interview_access[id]
               end
      sorted_resources.each do |resource|
        row << record[resource]
      end
      sorted_countries.each do |country|
        row << record[country]
      end
      data << row
    end

    puts "Interview-Zugriffe im Monat #{date.month} #{date.year}:"
    data.each do |row|
      puts row.map{|i| i.to_s.rjust(8)}.join('|')
    end
  end

  def self.create_searches_report(date)
    reports = UsageReport.logged_in_month(date).searches.scoped({:include => :user_account})
    searches = {:total => {:total => 0, :users => []}}
    queries = {}
    facets = {}
    countries = {}
    reports.each do |report|
      query = report.query
      person = report.facets['person_name']
      country = report.country
      countries[country] ||= 0
      countries[country] += 1
      searches[:total][country] ||= 0
      searches[:total][country] += 1
      searches[:total][:total] += 1
      if query.blank? && !person.blank?
        query = person
      end
      queries[query] ||= 0
      queries[query] += 1
      searches[query] ||= {:total => 0, :users => []}
      searches[query][:total] += 1
      searches[query][country] ||= 0
      searches[query][country] += 1
      report.facets.each_pair do |facet, values|
        next if facet == 'person_name'
        facets[facet] ||= 0
        facets[facet] += 1
        searches[query][facet] ||= 0
        searches[query][facet] += 1
        searches[:total][facet] ||= 0
        searches[:total][facet] += 1
      end
      unless report.user_account.nil?
        searches[:total][:users] << report.user_account_id unless searches[:total][:users].include?(report.user_account_id)
        searches[query][:users] << report.user_account_id unless searches[query][:users].include?(report.user_account_id)
      end
    end
    sorted_queries = queries.to_a.sort{|a,b| b.last <=> a.last }.map{|q| q.first}
    sorted_countries = countries.to_a.sort{|a,b| b.last <=> a.last }.map{|c| c.first}
    sorted_facets = facets.to_a.sort{|a,b| b.last <=> a.last }.map{|f| f.first}
    data = []
    row = %w(Suchbegriff Zugriffe Nutzer) + sorted_facets + sorted_countries
    data << row
    (['Insgesamt'] + sorted_queries).each do |q|
      row = []
      record = case q
                 when 'Insgesamt'
                   searches[:total]
                 else
                   searches[q]
               end
      row << q
      row << record[:total]
      row << record[:users].size
      sorted_facets.each do |f|
        row << record[f] || 0
      end
      sorted_countries.each do |country|
        row << record[country] || 0
      end
      data << row
    end
    puts "#{sorted_queries.size} Suchbegriffe"
    puts "#{sorted_facets.size} Facetten"
    puts "#{sorted_countries.size} Länder"
    puts "Such-Zugriffe im Monat #{date.month} #{date.year}:"
    data.each do |row|
      puts row.map{|i| i.to_s.rjust(8)}.join('|')
    end
    nil
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
